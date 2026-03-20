import { OdooTicketDTO } from "../../dto/OdooTicketDTO";

export interface LoginProbAutomationUseCase {
    processTicket(odooTicket: OdooTicketDTO[]): Promise<void>;
}