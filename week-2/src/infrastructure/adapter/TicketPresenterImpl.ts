import { TicketPresenters } from "../../application/port/OutboundPort/TicketPresenters";
import { Ticket } from "../../domain/ticket";

export class TicketPresenterImpl implements TicketPresenters {
  presentTicketList(tickets: Ticket[]): string {
    if (tickets.length === 0) return "No tickets found.";
    return tickets
      .map(t => `[${t.id}] ${t.title} | ${t.status.getValue()} | ${t.priority.getValue()}`)
      .join("\n");
  }

  presentTicketDetail(ticket: Ticket): string {
    return [
      `ID: ${ticket.id}`,
      `Title: ${ticket.title}`,
      `Description: ${ticket.description}`,
      `Status: ${ticket.status.getValue()}`,
      `Priority: ${ticket.priority.getValue()}`,
      `Tags: ${ticket.tags.map(t => t.getValue()).join(", ") || "none"}`,
    ].join("\n");
  }

  presentError(error: Error): string {
    return `Error: ${error.message}`;
  }

  presentSuccess(message: string): string {
    return message;
  }
}