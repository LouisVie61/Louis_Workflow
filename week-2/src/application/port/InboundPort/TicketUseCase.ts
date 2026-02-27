import { TicketDTO } from '../../dto/TicketDTO';

export interface TicketUseCase {
    createTicket(title: string, description: string, status: string, priority: string, tags: string[]): Promise<TicketDTO>;
    filterTickets(status?: string, priority?: string, tags?: string[]): Promise<TicketDTO[]>;
    findTicketById(id: number): Promise<TicketDTO>;
    updateTicket(id: number, status?: string, priority?: string): Promise<void>;
    listAllTickets(): Promise<TicketDTO[]>;
}