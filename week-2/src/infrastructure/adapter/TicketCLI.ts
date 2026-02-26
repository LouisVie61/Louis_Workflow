import { TicketUseCase } from "../../application/port/InboundPort/TicketUseCase";
import { TicketPresenters } from "../../application/port/OutboundPort/TicketPresenters";
import { StatusTicket } from "../../domain/ValueObjects/StatusTicket";
import { PriorityTicket } from "../../domain/ValueObjects/PriorityTicket";
import { Tag } from "../../domain/ValueObjects/TagTicket";

export class CLIAdapter {
  constructor(
    private readonly useCase: TicketUseCase,
    private readonly presenter: TicketPresenters
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
            await this.handleList();
            break;
          case "show":
            await this.handleShow(rest);
            break;
          case "update":
            await this.handleUpdate(rest);
            break;
          default:
            console.log("Commands: create | list | show <id> | update <id>");
        }
      }
    } catch (err) {
      console.log(this.presenter.presentError(err as Error));
    }
  }

  private async handleCreate(args: string[]): Promise<void> {
    const [title, desc, status, priority, tagsStr] = args;

    if (!title || !desc) {
      console.log('Usage: tickets create <title> <description> [status] [priority] [tag1,tag2]');
      return;
    }

    const tags = tagsStr ? tagsStr.split(",").map(t => new Tag(t)) : [];
    const ticket = await this.useCase.createTicket(
       title,
       desc,
       new StatusTicket(status ?? "OPEN"),
       new PriorityTicket(priority ?? "MEDIUM"),
       tags
    );
    console.log(this.presenter.presentSuccess(`Created ticket #${ticket.id}`));
  }

  private async handleList(): Promise<void> {
    const tickets = await this.useCase.listAllTickets();
    console.log(this.presenter.presentTicketList(tickets));
  }

  private async handleShow(args: string[]): Promise<void> {
    const ticket = await this.useCase.findTicketById(Number(args[0]));
    console.log(this.presenter.presentTicketDetail(ticket));
  }

  private async handleUpdate(args: string[]): Promise<void> {
    const id = Number(args[0]);

    if (!id || isNaN(id)) {
      console.log('Usage: tickets update <id> [--status <status>] [--priority <priority>]');
      return;
    }

    const statusIdx = args.indexOf("--status");
    const priorityIdx = args.indexOf("--priority");
    const status = statusIdx !== -1 ? new StatusTicket(args[statusIdx + 1]) : undefined;
    const priority = priorityIdx !== -1 ? new PriorityTicket(args[priorityIdx + 1]) : undefined;
    
    if (!status && !priority) {
      console.log('Nothing to update. Use --status or --priority');
      return;
    }

    await this.useCase.updateTicket(id, status, priority);
    console.log(this.presenter.presentSuccess(`Updated ticket #${id}`));
  }
}