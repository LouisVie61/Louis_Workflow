import { TicketUseCase } from "../../application/port/InboundPort/TicketUseCase";
import { TicketPresenters } from "../../application/port/OutboundPort/TicketPresenters";
import { OdooTicketUseCase } from "../../application/port/InboundPort/OdooTicketUseCase";
import { OdooTicketPresenters } from "../../application/port/OutboundPort/TicketPresentersNew";

export class CLIAdapter {
    constructor(
        private readonly useCase: TicketUseCase,
        private readonly presenter: TicketPresenters,
        private readonly odooUseCase: OdooTicketUseCase,
        private readonly odooPresenter: OdooTicketPresenters
    ) {}

    async run(args: string[]): Promise<void> {
        const [command, subCommand, ...rest] = args;

        try {
            if (command === "tickets") {
                switch (subCommand) {
                    case "create":
                        await this.handleCreate(rest);
                        break;
                    case "list":
                        console.log(this.odooPresenter.presentTicketList(await this.odooUseCase.listTickets()));
                        break;
                    case "new":
                        console.log(this.odooPresenter.presentTicketList(await this.odooUseCase.getNewTickets()));
                        break;
                    case "unprocessed":
                        console.log(this.odooPresenter.presentTicketList(await this.odooUseCase.getUnprocessedTickets()));
                        break;
                    case "show":
                        const id = Number(rest[0]);
                        if (!rest[0] || isNaN(id)) {
                            console.log('Usage: tickets show <id>');
                            return;
                        }
                        console.log(this.odooPresenter.presentTicketDetail(await this.odooUseCase.getTicketById(id)));
                        break;
                    case "update": {
                        const ticketId = Number(rest[0]);
                        if (!rest[0] || isNaN(ticketId)) {
                            console.log('Usage: tickets update <id> [status] [priority]');
                            return;
                        }
                        await this.odooUseCase.updateTicket(ticketId, rest[1], rest[2]);
                        console.log(this.odooPresenter.presentTicketDetail(await this.odooUseCase.getTicketById(ticketId)));
                        break;
                    }
                    default:
                        console.log(this.presenter.presentSuccess(
                            "Commands: create | list | new | unprocessed | show <id> | update <id>"
                        ));
                }
            }
        } catch (err) {
                const isOdooCommand = ["list", "new", "unprocessed", "show", "update"].includes(subCommand);            if (isOdooCommand) {
                console.log(this.odooPresenter.presentError(err as Error));
            } else {
                console.log(this.presenter.presentError(err as Error));
            }
        }
    }

    private async handleCreate(args: string[]): Promise<void> {
        const [title, desc, status, priority, tagsStr] = args;

        if (!title || !desc) {
            console.log('Usage: tickets create <title> <description> [status] [priority] [tag1,tag2]');
            return;
        }

        const tags = tagsStr ? tagsStr.split(",") : [];
        const ticket = await this.useCase.createTicket(
            title, desc,
            status ?? "OPEN",
            priority ?? "MEDIUM",
            tags
        );
        console.log(this.presenter.presentSuccess(`Created ticket #${ticket.id}`));
    }

    /**
     * Update ticket stored in file
     * @param args 
     * @returns Updated message or error 
     */
    private async handleUpdate(args: string[]): Promise<void> {
        const id = Number(args[0]);

        if (!id || isNaN(id)) {
            console.log('Usage: tickets update <id> [--status <status>] [--priority <priority>]');
            return;
        }

        const statusIdx = args.indexOf("--status");
        const priorityIdx = args.indexOf("--priority");
        const status = statusIdx !== -1 ? args[statusIdx + 1] : undefined;
        const priority = priorityIdx !== -1 ? args[priorityIdx + 1] : undefined;

        if (!status && !priority) {
            console.log('Nothing to update. Use --status or --priority');
            return;
        }

        await this.useCase.updateTicket(id, status, priority);
        console.log(this.presenter.presentSuccess(`Updated ticket #${id}`));
    }
}