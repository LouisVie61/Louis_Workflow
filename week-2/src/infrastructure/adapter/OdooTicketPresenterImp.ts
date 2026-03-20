import { OdooTicketPresenters } from "../../application/port/OutboundPort/TicketPresentersNew";
import { OdooTicketDTO } from "../../application/dto/OdooTicketDTO";

export class OdooTicketPresenterImpl implements OdooTicketPresenters {
    presentTicketList(tickets: OdooTicketDTO[]): string {
        if (tickets.length === 0) return "No tickets found.";
        return tickets
            .map(t => `[${t.id}] ${t.title} | ${t.status} | ${t.priority} | ${t.partnerName}`)
            .join("\n");
    }

    presentTicketDetail(ticket: OdooTicketDTO): string {
        return [
            `ID:          ${ticket.id}`,
            `Title:       ${ticket.title}`,
            `Description: ${ticket.description}`,
            `Status:      ${ticket.status}`,
            `Priority:    ${ticket.priority}`,
            `Tags:        ${ticket.tags.join(", ") || "none"}`,
            `Time Spent:  ${ticket.timeSpent}h`,
            `Created:     ${ticket.createDate}`,
            `Updated:     ${ticket.updateDate}`,
            `Customer:    ${ticket.partnerName}`,
            'Email:       ' + (ticket.partnerEmail || "N/A"),
            `Team:        ${ticket.teamId}`,
        ].join("\n");
    }

    presentError(error: Error): string {
        return `Error: ${error.message}`;
    }
}