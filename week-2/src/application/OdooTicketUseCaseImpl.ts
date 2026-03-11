import { OdooTicketUseCase } from './port/InboundPort/OdooTicketUseCase';
import { OdooTicketRepository } from './port/OutboundPort/TicketRepositoryNew';
import { OdooTicketDTO } from './dto/OdooTicketDTO';

export class OdooTicketUseCaseImpl implements OdooTicketUseCase {
    constructor(private readonly repo: OdooTicketRepository) {}

    listTickets(): Promise<OdooTicketDTO[]> {
        return this.repo.listTickets();
    }

    getNewTickets(): Promise<OdooTicketDTO[]> {
        return this.repo.getNewTickets();
    }

    getUnprocessedTickets(): Promise<OdooTicketDTO[]> {
        return this.repo.getUnprocessedTickets();
    }

    getTicketById(id: number): Promise<OdooTicketDTO> {
        return this.repo.getTicketById(id);
    }

    updateTicket(id: number, status?: string, priority?: string): Promise<void> {
        return this.repo.updateTicket(id, status, priority);
    }
}