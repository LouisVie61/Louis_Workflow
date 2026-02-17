import { Ticket } from '../ticket';
import { StatusTicket } from '../ValueObjects/StatusTicket';
import { PriorityTicket } from '../ValueObjects/PriorityTicket';
import { TicketRepository } from '../../application/port/OutboundPort/TicketRepository';

export class TicketService {
    constructor(private readonly ticketRepository: TicketRepository) {}

    createTicket(
        id: number,
        description: string,
        status: StatusTicket,
        priority: PriorityTicket,
        tags: string[]
    ): void {
        const title = `Ticket #${id}`;
        const ticket = new Ticket(id, title, description, status, priority, tags);

        if (priority.getValue() === PriorityTicket.HIGH && !ticket.hasTag('urgent')) {
            ticket.addTag('urgent');
        }

        this.ticketRepository.save(ticket);
    }

    filterTickets(
        id: number,
        status?: StatusTicket,
        priority?: PriorityTicket,
        tags?: string[]
    ): Ticket[] {
        const ticket = this.ticketRepository.findById(id);
        if (ticket === null) {
            throw new Error("Ticket not found");
        }

        return ticket.matchesFilters(status, priority, tags) ? [ticket] : [];
    }

    searchTicket(id: number): Ticket {
        const ticket = this.ticketRepository.findById(id);
        if (ticket === null) {
            throw new Error("Ticket not found");
        }
        return ticket;
    }

    updateTicket(id: number, status?: StatusTicket, priority?: PriorityTicket): void {
        const ticket = this.ticketRepository.findById(id);
        if (ticket === null) {
            throw new Error("Ticket not found");
        }

        if (status) {
            ticket.updateStatus(status);
        }
        if (priority) {
            ticket.updatePriority(priority);
        }

        this.ticketRepository.save(ticket);
        console.log(`Ticket ${id} updated successfully`);
    }
}