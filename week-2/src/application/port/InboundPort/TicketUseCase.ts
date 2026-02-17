import { Ticket } from '../../../domain/ticket';
import { StatusTicket } from '../../../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../../domain/ValueObjects/PriorityTicket';
import { TicketRepository } from '../OutboundPort/TicketRepository';
import { TicketService } from '../../../domain/Services/TicketService';

export class TicketUseCase {
    private ticketService: TicketService;
    
    constructor(ticketRepository: TicketRepository) { // Inversion
        this.ticketService = new TicketService(ticketRepository);
    }

    createTicket(
        id: number,
        description: string,
        status: StatusTicket,
        priority: PriorityTicket,
        tags: string[]
    ): Ticket {
        this.ticketService.createTicket(id, description, status, priority, tags);
        return this.ticketService.filterTickets(id)[0];
    }

    filterTickets(
        id: number,
        status?: StatusTicket,
        priority?: PriorityTicket,
        tags?: string[]
    ): Ticket[] {
        return this.ticketService.filterTickets(id, status, priority, tags);
    }

    findTicketById(id: number): Ticket {
        return this.ticketService.searchTicket(id);
    }

}