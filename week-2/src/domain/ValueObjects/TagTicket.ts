export class Tag {
    private readonly value: string;

    constructor(tag: string) {
        this.validate(tag);
        this.value = tag.toLowerCase().trim();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Tag): boolean {
        return this.value === other.getValue();
    }

    private validate(tag: string): void {
        if (!tag || tag.trim().length === 0) {
            throw new Error("Tag cannot be empty");
        }
        if (tag.length > 50) {
            throw new Error("Tag too long (max 50 chars)");
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(tag)) {
            throw new Error("Tag contains invalid characters");
        }
    }
}