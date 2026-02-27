import { Ticket } from '../ticket';
import { StatusTicket } from '../ValueObjects/StatusTicket';
import { PriorityTicket } from '../ValueObjects/PriorityTicket';
import { Tag } from '../ValueObjects/TagTicket';

export class TicketService {
    generateId(existingTickets: Ticket[]): number {
        if (existingTickets.length === 0) return 1;
        return Math.max(...existingTickets.map(t => t.id)) + 1;
    }

    applyBusinessRules(ticket: Ticket): void {
        if (ticket.priority.getValue() === PriorityTicket.HIGH && !ticket.hasTag('urgent')) {
            ticket.addTag(new Tag('urgent'));
        }
    }

    filterTickets(tickets: Ticket[], status?: StatusTicket, priority?: PriorityTicket, tags?: Tag[]): Ticket[] {
        return tickets.filter(ticket => ticket.matchesFilters(status, priority, tags));
    }
}