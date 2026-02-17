export class PriorityTicket {
    public static readonly HIGH = 'HIGH';
    public static readonly MEDIUM = 'MEDIUM';
    public static readonly LOW = 'LOW';

    private readonly value: 'HIGH' | 'MEDIUM' | 'LOW';

    constructor(priority: string) {
        if (['HIGH', 'MEDIUM', 'LOW'].indexOf(priority.toUpperCase()) === -1) {
            throw new Error('Invalid priority value');
        }
        this.value = priority.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW';
    }

    getValue(): string {
        return this.value;
    }

    equals (other: PriorityTicket): boolean {
        return this.value === other.getValue();
    }

    isHigherThan (other: PriorityTicket): boolean {
        const priorityOrders = ['LOW', 'MEDIUM', 'HIGH'];
        return priorityOrders.indexOf(this.value) > priorityOrders.indexOf(other.getValue());
    }

    toString(): string {
        return this.value;
    }
}