import { TicketDTO } from '../../dto/TicketDTO';

export interface TicketPresenters {
    presentTicketList(tickets: TicketDTO[]): string;
    presentTicketDetail(ticket: TicketDTO): string;
    presentError(error: Error): string;
    presentSuccess(message: string): string;
}