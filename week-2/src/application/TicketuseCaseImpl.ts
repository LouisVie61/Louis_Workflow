import { TicketUseCase } from './port/InboundPort/TicketUseCase';
import { TicketDTO } from './dto/TicketDTO';
import { Ticket } from '../domain/ticket';
import { StatusTicket } from '../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../domain/ValueObjects/PriorityTicket';
import { Tag } from '../domain/ValueObjects/TagTicket';
import { TicketRepository } from './port/OutboundPort/TicketRepository';
import { TicketService } from '../domain/Services/TicketService';

export class TicketUseCaseImpl implements TicketUseCase {
    constructor(
        private readonly ticketRepository: TicketRepository,
        private readonly ticketService: TicketService
    ) {}

    private toDTO(ticket: Ticket): TicketDTO {
        return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status.getValue(),
            priority: ticket.priority.getValue(),
            tags: ticket.tags.map(t => t.getValue()),
        };
    }

    async createTicket(title: string, description: string, status: string, priority: string, tags: string[]): Promise<TicketDTO> {
        const allTickets = await this.ticketRepository.findAll();
        const id = this.ticketService.generateId(allTickets);
        const ticket = new Ticket(
            id, title, description,
            new StatusTicket(status),
            new PriorityTicket(priority),
            tags.map(t => new Tag(t))
        );
        this.ticketService.applyBusinessRules(ticket);
        await this.ticketRepository.create(ticket);
        return this.toDTO(ticket);
    }

    async filterTickets(status?: string, priority?: string, tags?: string[]): Promise<TicketDTO[]> {
        const allTickets = await this.ticketRepository.findAll();
        return this.ticketService.filterTickets(
            allTickets,
            status ? new StatusTicket(status) : undefined,
            priority ? new PriorityTicket(priority) : undefined,
            tags ? tags.map(t => new Tag(t)) : undefined
        ).map(t => this.toDTO(t));
    }

    async findTicketById(id: number): Promise<TicketDTO> {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) throw new Error(`Ticket #${id} not found`);
        return this.toDTO(ticket);
    }

    async updateTicket(id: number, status?: string, priority?: string): Promise<void> {
        const ticket = await this.ticketRepository.findById(id);
        if (!ticket) throw new Error(`Ticket #${id} not found`);
        if (status) ticket.updateStatus(new StatusTicket(status));
        if (priority) ticket.updatePriority(new PriorityTicket(priority));
        await this.ticketRepository.update(ticket);
    }

    async listAllTickets(): Promise<TicketDTO[]> {
        const tickets = await this.ticketRepository.findAll();
        return tickets.map(t => this.toDTO(t));
    }
}