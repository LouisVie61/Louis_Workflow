import { Ticket } from '../../../domain/ticket';

export interface TicketUseCase {
    createTicket(title: string, description: string, status: string, priority: string, tags: string[]): Promise<Ticket>;
    filterTickets(status?: string, priority?: string, tags?: string[]): Promise<Ticket[]>;
    findTicketById(id: number): Promise<Ticket>;
    updateTicket(id: number, status?: string, priority?: string): Promise<void>;
    listAllTickets(): Promise<Ticket[]>;
}