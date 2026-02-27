import * as fs from 'fs';
import * as path from 'path';
import { TicketRepository } from '../../application/port/OutboundPort/TicketRepository';
import { Ticket } from '../../domain/entity/ticket';
import { StatusTicket } from '../../domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../domain/ValueObjects/PriorityTicket';
import { Tag } from '../../domain/ValueObjects/TagTicket';

export class FileTicketRepository implements TicketRepository {
  private readonly filePath: string;

  constructor(filePath: string = 'tickets.json') {
    this.filePath = path.resolve(filePath);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private load(): Ticket[] {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    const data = JSON.parse(raw) as any[];
    return data.map(t => {
      const id = t._id ?? t.id;
      const title = t._title ?? t.title;
      const description = t._description ?? t.description;
      const statusRaw = t._status ?? t.status;
      const status = typeof statusRaw === 'object' ? statusRaw.value : statusRaw;

      const priorityRaw = t._priority ?? t.priority;
      const priority = typeof priorityRaw === 'object' ? priorityRaw.value : priorityRaw;

      const tags = (t._tags ?? t.tags ?? []).map((tag: any) => {
        const tagValue = tag.value ?? tag._value ?? tag;
        return new Tag(tagValue);
      });

      return new Ticket(
        id,
        title,
        description,
        new StatusTicket(status),
        new PriorityTicket(priority),
        tags
      );
    });
  }

  private save(tickets: Ticket[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(tickets, null, 2));
  }

  async create(ticket: Ticket): Promise<void> {
    const tickets = this.load();
    tickets.push(ticket);
    this.save(tickets);
  }

  async findById(id: number): Promise<Ticket | null> {
    const tickets = this.load();
    return tickets.find(t => t.id === id) ?? null;
  }

  async findAll(): Promise<Ticket[]> {
    return this.load();
  }

  async update(ticket: Ticket): Promise<void> {
    const tickets = this.load();
    const idx = tickets.findIndex(t => t.id === ticket.id);
    if (idx === -1) throw new Error(`Ticket #${ticket.id} not found`);
    tickets[idx] = ticket;
    this.save(tickets);
  }

  async delete(id: number): Promise<void> {
    const tickets = this.load();
    this.save(tickets.filter(t => t.id !== id));
  }
}