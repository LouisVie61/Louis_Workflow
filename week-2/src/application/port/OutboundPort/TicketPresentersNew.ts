import { OdooTicketDTO } from "../../dto/OdooTicketDTO";

export interface OdooTicketPresenters {
    presentTicketList(tickets: OdooTicketDTO[]): string;
    presentTicketDetail(ticket: OdooTicketDTO): string;
    presentError(error: Error): string;
}