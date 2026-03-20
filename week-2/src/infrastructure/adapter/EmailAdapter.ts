import { OdooEmail } from "../../application/port/OutboundPort/OdooEmail";

export class EmailAdapter implements OdooEmail {
    async sendACKEmail(to: string, subject: string, body: string): Promise<void> {
        console.log(`Sending ACK email to ${to} with subject "${subject}" and body:\n${body}`);
    }

    async sendREEmail(to: string, subject: string, body: string): Promise<void> {
        console.log(`Sending RE email to ${to} with subject "${subject}" and body:\n${body}`);
    }

    async sendFUEmail(to: string, subject: string, body: string): Promise<void> {
        console.log(`Sending FU email to ${to} with subject "${subject}" and body:\n${body}`);
    }
}