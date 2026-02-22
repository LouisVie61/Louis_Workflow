import { Ticket } from '../../../domain/ticket';
import { StatusTicket } from '../../../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../../domain/ValueObjects/PriorityTicket';
import { TicketRepository } from '../OutboundPort/TicketRepository';
import { TicketService } from '../../../domain/Services/TicketService';
import { Tag } from '../../../domain/ValueObjects/TagTicket';

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
        tags: Tag[]
    ): Ticket {
        this.ticketService.createTicket(description, status, priority, tags);
        return this.ticketService.filterTickets(id)[0];
    }

    filterTickets(
        id: number,
        status?: StatusTicket,
        priority?: PriorityTicket,
        tags?: Tag[]
    ): Ticket[] {
        return this.ticketService.filterTickets(id, status, priority, tags);
    }

    findTicketById(id: number): Ticket {
        return this.ticketService.searchTicket(id);
    }

}