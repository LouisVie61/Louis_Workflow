import { TicketPresenterImpl } from "../adapter/TicketPresenterImpl";
import { CLIAdapter } from "../adapter/TicketCLI";
import { FileTicketRepository } from "../adapter/FileTicketRepositoryImpl";
import { TicketUseCaseImpl } from "../../application/TicketuseCaseImpl";

export class Container {
  static buildCLI(): CLIAdapter {
    const repo = new FileTicketRepository();
    const presenter = new TicketPresenterImpl();
    const useCase = new TicketUseCaseImpl(repo);
    return new CLIAdapter(useCase, presenter);
  }
}