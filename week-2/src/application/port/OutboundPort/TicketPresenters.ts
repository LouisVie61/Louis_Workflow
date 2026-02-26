import { Ticket } from "../../../domain/ticket";

export interface TicketPresenters {
    presentTicketList(tickets: Ticket[]): string;
    presentTicketDetail(ticket: Ticket): string;
    presentError(error: Error): string;
    presentSuccess(message: string): string;
}