import { TicketUseCase } from './port/InboundPort/TicketUseCase';
import { Ticket } from '../domain/ticket';
import { StatusTicket } from '../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../domain/ValueObjects/PriorityTicket';
import { Tag } from '../domain/ValueObjects/TagTicket';
import { TicketRepository } from './port/OutboundPort/TicketRepository';
import { TicketService } from '../domain/Services/TicketService';

export class TicketUseCaseImpl implements TicketUseCase {
    private readonly ticketService: TicketService;

    constructor(private readonly ticketRepository: TicketRepository) {
        this.ticketService = new TicketService();
    }

    async createTicket(title: string, description: string, status: StatusTicket, priority: PriorityTicket, tags: Tag[]): Promise<Ticket> {
        const allTickets = await this.ticketRepository.findAll();
        const id = this.ticketService.generateId(allTickets);
        const ticket = new Ticket(id, title, description, status, priority, tags);
        this.ticketService.applyBusinessRules(ticket);
        await this.ticketRepository.create(ticket);
        return ticket;
    }

    async filterTickets(status?: StatusTicket, priority?: PriorityTicket, tags?: Tag[]): Promise<Ticket[]> {
        const allTickets = await this.ticketRepository.findAll();
        return this.ticketService.filterTickets(allTickets, status, priority, tags);
    }

    async findTicketById(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) throw new Error(`Ticket #${id} not found`);
        return ticket;
    }

    async updateTicket(id: number, status?: StatusTicket, priority?: PriorityTicket): Promise<void> {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) throw new Error(`Ticket #${id} not found`);
        if (status) ticket.updateStatus(status);
        if (priority) ticket.updatePriority(priority);
        await this.ticketRepository.update(ticket);
    }

    async listAllTickets(): Promise<Ticket[]> {
        return await this.ticketRepository.findAll();
    }
}