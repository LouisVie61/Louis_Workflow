export class StatusTicket {
    public static readonly OPEN = 'OPEN';
    public static readonly IN_PROGRESS = 'IN_PROGRESS';
    public static readonly DONE = 'DONE';
    public static readonly CLOSED = 'CLOSED';

    private readonly value: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CLOSED';

    constructor(status: string) {
        const upper = status.toUpperCase();
        const valid = [StatusTicket.OPEN, StatusTicket.IN_PROGRESS, StatusTicket.DONE, StatusTicket.CLOSED];
        
        if (valid.indexOf(upper) === -1) {
            throw new Error('Invalid status');
        }
        this.value = upper as any;
    }
    
    getValue(): string {
        return this.value;
    }
}