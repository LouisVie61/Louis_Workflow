import { Worker } from "../adapter/Worker";
import { OdooTicketRepositoryImpl } from "../adapter/OdooTicketRepositoryImpl";
import { HTTPAdapter } from "../adapter/HTTPAdapter";
import { OdooTicketUseCaseImpl } from "../../application/OdooTicketUseCaseImpl";
import { IInvestigateAdapter } from "../adapter/IInvestigateAdapter";
import { TicketService } from "../../domain/Services/TicketService";
import { LoginProbAutomationUseCaseImpl } from "../../application/LoginProbAutomationUseCaseImpl";
import { EmailAdapter } from "../adapter/EmailAdapter";

export class WorkerContainer {
    static buildWorker(): Worker {
        const investigateMetrics = new IInvestigateAdapter();
        const odooEmail = new EmailAdapter();
        const odooRepo = new OdooTicketRepositoryImpl(
            process.env.ODOO_URL ?? "",
            process.env.ODOO_DB ?? "",
            process.env.ODOO_USERNAME ?? "",
            process.env.ODOO_PASSWORD ?? "",
            new HTTPAdapter()
        );
        const odooUseCase = new OdooTicketUseCaseImpl(odooRepo);
        const loginUC = new LoginProbAutomationUseCaseImpl(odooEmail, odooRepo, investigateMetrics);
        return new Worker(loginUC, odooUseCase);
    }
}