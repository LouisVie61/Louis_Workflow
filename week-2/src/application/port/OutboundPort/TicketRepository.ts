import { Ticket } from '../../../domain/ticket';
import { StatusTicket } from '../../../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../../domain/ValueObjects/PriorityTicket';

export interface TicketRepository {
    save(ticket: Ticket): void;
    findById(id: number): Ticket | null;
    findAll(): Ticket[];
    delete(id: number): void;
}