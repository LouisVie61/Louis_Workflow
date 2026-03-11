import { OdooTicketDTO } from "../../dto/OdooTicketDTO";

export interface OdooTicketRepository {
    listTickets(): Promise<OdooTicketDTO[]>;
    getNewTickets(): Promise<OdooTicketDTO[]>;
    getUnprocessedTickets(): Promise<OdooTicketDTO[]>;
    getTicketById(id: number): Promise<OdooTicketDTO>;
    updateTicket(id: number, status?: string, priority?: string): Promise<void>;
}