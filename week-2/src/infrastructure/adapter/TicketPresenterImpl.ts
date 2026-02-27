import { TicketPresenters } from "../../application/port/OutboundPort/TicketPresenters";
import { TicketDTO } from "../../application/dto/TicketDTO";

export class TicketPresenterImpl implements TicketPresenters {
  presentTicketList(tickets: TicketDTO[]): string {
    if (tickets.length === 0) return "No tickets found.";
    return tickets
      .map(t => `[${t.id}] ${t.title} | ${t.status} | ${t.priority}`)
      .join("\n");
  }

  presentTicketDetail(ticket: TicketDTO): string {
    return [
      `ID: ${ticket.id}`,
      `Title: ${ticket.title}`,
      `Description: ${ticket.description}`,
      `Status: ${ticket.status}`,
      `Priority: ${ticket.priority}`,
      `Tags: ${ticket.tags.join(", ") || "none"}`,
    ].join("\n");
  }

  presentError(error: Error): string {
    return `Error: ${error.message}`;
  }

  presentSuccess(message: string): string {
    return message;
  }
}