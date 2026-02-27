import { TicketPresenterImpl } from "../adapter/TicketPresenterImpl";
import { CLIAdapter } from "../adapter/TicketCLI";
import { FileTicketRepository } from "../adapter/FileTicketRepositoryImpl";
import { TicketUseCaseImpl } from "../../application/TicketuseCaseImpl";
import { TicketService } from "../../domain/Services/TicketService";

export class Container {
  static buildCLI(): CLIAdapter {
    const repo = new FileTicketRepository();
    const presenter = new TicketPresenterImpl();
    const ticketService = new TicketService();
    const useCase = new TicketUseCaseImpl(repo, ticketService);
    return new CLIAdapter(useCase, presenter);
  }
}