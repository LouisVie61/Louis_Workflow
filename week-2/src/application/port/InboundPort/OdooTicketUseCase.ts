import { OdooTicketDTO } from "../../dto/OdooTicketDTO";

export interface OdooTicketUseCase {
    listTickets(): Promise<OdooTicketDTO[]>;
    getNewTickets(): Promise<OdooTicketDTO[]>;
    getUnprocessedTickets(): Promise<OdooTicketDTO[]>;
    getTicketById(id: number): Promise<OdooTicketDTO>;
}