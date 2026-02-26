import { Ticket } from '../../../domain/ticket';
import { StatusTicket } from '../../../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../../domain/ValueObjects/PriorityTicket';
import { Tag } from '../../../domain/ValueObjects/TagTicket';

export interface TicketUseCase {
    createTicket(title: string, description: string, status: StatusTicket, priority: PriorityTicket, tags: Tag[]): Promise<Ticket>;
    filterTickets(status?: StatusTicket, priority?: PriorityTicket, tags?: Tag[]): Promise<Ticket[]>;
    findTicketById(id: number): Promise<Ticket>;
    updateTicket(id: number, status?: StatusTicket, priority?: PriorityTicket): Promise<void>;
    listAllTickets(): Promise<Ticket[]>;
}