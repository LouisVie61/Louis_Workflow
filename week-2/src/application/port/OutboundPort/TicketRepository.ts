import { Ticket } from '../../../domain/ticket';

export interface TicketRepository {
    create(ticket: Ticket): Promise<void>;
    findById(id: number): Promise<Ticket | null>;
    findAll(): Promise<Ticket[]>;
    update(ticket: Ticket): Promise<void>;
    delete(id: number): Promise<void>;
}