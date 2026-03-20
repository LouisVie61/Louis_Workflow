export interface OdooEmail {
    sendACKEmail(to: string, subject: string, body: string): Promise<void>;
    sendREEmail(to: string, subject: string, body: string): Promise<void>;
    sendFUEmail(to: string, subject: string, body: string): Promise<void>;
}