import { TicketPresenterImpl } from "../adapter/TicketPresenterImpl";
import { CLIAdapter } from "../adapter/TicketCLI";
import { FileTicketRepository } from "../adapter/FileTicketRepositoryImpl";
import { TicketUseCaseImpl } from "../../application/TicketuseCaseImpl";
import { TicketService } from "../../domain/Services/TicketService";
import { OdooTicketRepositoryImpl } from "../adapter/OdooTicketRepositoryImpl";
import { OdooTicketUseCaseImpl } from "../../application/OdooTicketUseCaseImpl";
import { HTTPAdapter } from "../adapter/HTTPAdapter";
import { OdooTicketPresenterImpl } from "../adapter/OdooTicketPresenterImp";

export class Container {
    static buildCLI(): CLIAdapter {
        const repo = new FileTicketRepository();
        const presenter = new TicketPresenterImpl();
        const ticketService = new TicketService();
        const useCase = new TicketUseCaseImpl(repo, ticketService);

        const odooRepo = new OdooTicketRepositoryImpl(
            process.env.ODOO_URL ?? "",
            process.env.ODOO_DB ?? "",
            process.env.ODOO_USERNAME ?? "",
            process.env.ODOO_API_KEY ?? "",
            new HTTPAdapter()
        );
        const odooUseCase = new OdooTicketUseCaseImpl(odooRepo);
        const odooPresenter = new OdooTicketPresenterImpl();

        return new CLIAdapter(useCase, presenter, odooUseCase, odooPresenter);
    }
}