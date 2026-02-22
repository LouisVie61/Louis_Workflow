// src/domain/ticket.ts
import { StatusTicket } from './ValueObjects/StatusTicket';
import { PriorityTicket } from './ValueObjects/PriorityTicket';
import { Tag } from './ValueObjects/TagTicket';

export class Ticket {
    private _id: number;
    private _title: string;
    private _description: string;
    private _status: StatusTicket;
    private _priority: PriorityTicket;
    private _tags: Tag[];

    constructor(
        id: number, 
        title: string, 
        description: string, 
        status: StatusTicket, 
        priority: PriorityTicket, 
        tags: Tag[]
    ) {
        this.validateId(id);
        this.validateDescription(description);
        
        this._id = id;
        this._title = title;
        this._description = description;
        this._status = status;
        this._priority = priority;
        this._tags = tags;
    }

    get id(): number { return this._id; }
    get title(): string { return this._title; }
    get description(): string { return this._description; }
    get status(): StatusTicket { return this._status; }
    get priority(): PriorityTicket { return this._priority; }
    get tags(): Tag[] { return [...this._tags]; }

    updateStatus(newStatus: StatusTicket): void {
        if (this._status.getValue() === StatusTicket.CLOSED && newStatus.getValue() === StatusTicket.OPEN) {
            throw new Error("Cannot reopen a closed ticket");
        }
        this._status = newStatus;
    }

    updatePriority(newPriority: PriorityTicket): void {
        this._priority = newPriority;
    }

    addTag(tag: Tag): void {
        if (!this._tags.some(t => t.equals(tag))) {
            this._tags.push(tag);
        }
    }

    removeTag(tag: Tag): void {
        this._tags = this._tags.filter(t => !t.equals(tag));
    }

    hasTag(tag: string): boolean {
        return this._tags.some(t => t.getValue() === tag);
    }

    matchesFilters(status?: StatusTicket, priority?: PriorityTicket, tags?: Tag[]): boolean {
        if (status && this._status.getValue() !== status.getValue()) return false;
        if (priority && !this._priority.equals(priority)) return false;
        if (tags && tags.length > 0) {
            const hasAllTags = tags.every(tag => this._tags.some(t => t.equals(tag)));
            if (!hasAllTags) return false;
        }
        return true;
    }

    private validateId(id: number): void {
        if (id <= 0) {
            throw new Error("Ticket ID must be positive");
        }
    }

    private validateDescription(description: string): void {
        if (!description || description.trim().length === 0) {
            throw new Error("Ticket description cannot be empty");
        }
    }
}