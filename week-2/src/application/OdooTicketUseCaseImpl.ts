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

    async filterLoginProbTickets(tickets: OdooTicketDTO[]): Promise<OdooTicketDTO[]> {
        const keywords = [
            "login",
            "cannot login",
            "can't login",
            "invalid username",
            "invalid password",
            "invalid username or password",
            "đăng nhập",
            "không đăng nhập được",
            "quên mật khẩu",
            "forgot password"
        ];

        return tickets.filter(t => {
            const text = (
                (t.title ?? "") + " " +
                (t.description ?? "")
            ).toLowerCase();
            const keywordMatch = keywords.some(k => text.includes(k));
            const tagMatch = t.tags?.includes("login");
            return keywordMatch || tagMatch;
        });
    }
}