import { OdooTicketDTO } from "../../application/dto/OdooTicketDTO";
import { OdooTicketRepository } from "../../application/port/OutboundPort/TicketRepositoryNew";
import { IHTTPAdapter } from "../../application/port/OutboundPort/IHTTPAdapter";

export class OdooTicketRepositoryImpl implements OdooTicketRepository {
    private uid: number = 0;

    constructor(
        private readonly baseUrl: string,
        private readonly db: string,
        private readonly username: string,
        private readonly password: string,
        private readonly http: IHTTPAdapter
    ) {}

    private async authenticate(): Promise<void> {
        const res = await this.http.post(`${this.baseUrl}/web/session/authenticate`, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                db: this.db,
                login: this.username,
                password: this.password,
            },
        });
        if (!res.result?.uid) throw new Error("Odoo authentication failed");
        this.uid = res.result.uid;
    }

    private async ensureAuthenticated(): Promise<void> {
        if (this.uid === 0) {
            await this.authenticate();
        }
    }

    private async search(domain: any[]): Promise<OdooTicketDTO[]> {
        await this.ensureAuthenticated();
        const res = await this.http.post(`${this.baseUrl}/jsonrpc`, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    this.db,
                    this.uid,
                    this.password,
                    "helpdesk.ticket",
                    "search_read",
                    [domain],
                    {
                        fields: ["id", "name", "description", "stage_id", "priority", "tag_ids", "close_hours", "create_date", "partner_name", "team_id"],
                    },
                ],
            },
        });
        if (res.error) throw new Error(res.error.data?.message ?? "Odoo error");
        return (res.result as any[]).map(OdooTicketRepositoryImpl.mapToDTO);
    }
    async listTickets(): Promise<OdooTicketDTO[]> {
        return this.search([]);
    }

    async getNewTickets(): Promise<OdooTicketDTO[]> {
        const yesterday = new Date(Date.now() - 86400000)
            .toISOString().replace('T', ' ').slice(0, 19);
        return this.search([["create_date", ">=", yesterday]]);
    }

    async getUnprocessedTickets(): Promise<OdooTicketDTO[]> {
        return this.search([["stage_id.name", "=", "New"]]);
    }

    async getTicketById(id: number): Promise<OdooTicketDTO> {
        const results = await this.search([["id", "=", id]]);
        if (!results.length) throw new Error(`Ticket #${id} not found`);
        return results[0];
    }

    private static mapToDTO(t: any): OdooTicketDTO {
        return {
            id: t.id,
            title: t.name,
            description: t.description ?? "",
            status: t.stage_id?.[1] ?? "Unknown",
            priority: t.priority === "2" ? "HIGH" : t.priority === "1" ? "MEDIUM" : "LOW",
            tags: (t.tag_ids ?? []).map(String),
            timeSpent: t.close_hours ?? 0,
            createDate: t.create_date ?? "",
            partnerName: t.partner_name ?? "",
            teamId: t.team_id?.[1] ?? "",
        };
    }
}