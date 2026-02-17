// src/domain/ticket.ts
import { StatusTicket } from './ValueObjects/StatusTicket';
import { PriorityTicket } from './ValueObjects/PriorityTicket';

export class Ticket {
    private _id: number;
    private _title: string;
    private _description: string;
    private _status: StatusTicket;
    private _priority: PriorityTicket;
    private _tags: string[];

    constructor(
        id: number, 
        title: string, 
        description: string, 
        status: StatusTicket, 
        priority: PriorityTicket, 
        tags: string[]
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
    get tags(): string[] { return [...this._tags]; }

    updateStatus(newStatus: StatusTicket): void {
        if (this._status.getValue() === StatusTicket.CLOSED && newStatus.getValue() === StatusTicket.OPEN) {
            throw new Error("Cannot reopen a closed ticket");
        }
        this._status = newStatus;
    }

    updatePriority(newPriority: PriorityTicket): void {
        this._priority = newPriority;
    }

    addTag(tag: string): void {
        if (this._tags.indexOf(tag) === -1) {
            this._tags.push(tag);
        }
    }

    removeTag(tag: string): void {
        this._tags = this._tags.filter(t => t !== tag);
    }

    hasTag(tag: string): boolean {
        return this._tags.indexOf(tag) !== -1;
    }

    matchesFilters(status?: StatusTicket, priority?: PriorityTicket, tags?: string[]): boolean {
        if (status && this._status.getValue() !== status.getValue()) return false;
        if (priority && !this._priority.equals(priority)) return false;
        if (tags && tags.length > 0) {
            const hasAllTags = tags.every(tag => this._tags.indexOf(tag) !== -1);
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