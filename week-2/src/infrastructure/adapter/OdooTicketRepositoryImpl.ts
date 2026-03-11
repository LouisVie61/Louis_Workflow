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

    private async execute(model: string, method: string, args: any[]): Promise<any> {
        await this.ensureAuthenticated();
        const res = await this.http.post(`${this.baseUrl}/jsonrpc`, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [this.db, this.uid, this.password, model, method, ...args],
            }
        });
        if (res.error) throw new Error(res.error.data?.message ?? "Odoo error");
        return res.result;
    }

    private async search(domain: any[]): Promise<OdooTicketDTO[]> {
        const result = await this.execute("helpdesk.ticket", "search_read", [
            [domain],
            { fields: ["id", "name", "description", "stage_id", "priority", "tag_ids", "close_hours", "create_date", "write_date", "partner_name", "team_id"] },
        ]);

        const allTagIds: number[] = [...new Set(
            (result as any[]).flatMap((t: any) => t.tag_ids ?? [])
        )];

        const tagMap: Record<number, string> = {};
        if (allTagIds.length > 0) {
            const tags = await this.execute("helpdesk.tag", "read", [
                [allTagIds],
                { fields: ["id", "name"] },
            ]);
            for (const tag of tags) {
                tagMap[tag.id] = tag.name;
            }
        }

        return (result as any[]).map(t => OdooTicketRepositoryImpl.mapToDTO(t, tagMap));
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

    async updateTicket(id: number, status?: string, priority?: string): Promise<void> {
        const updates: any = {};

        if (status) {
            const stages = await this.execute("helpdesk.stage", "search_read", [
                [[["name", "=", status]]],
                { fields: ["id"], limit: 1 },
            ]);
            if (!stages.length) throw new Error(`Stage "${status}" not found`);
            updates.stage_id = stages[0].id;
        }

        if (priority) {
            updates.priority = priority === "HIGH" ? "2" : priority === "MEDIUM" ? "1" : "0";
        }

        if (Object.keys(updates).length === 0) return;

        await this.execute("helpdesk.ticket", "write", [[id], updates]);
    }

    private static mapToDTO(t: any, tagMap: Record<number, string>): OdooTicketDTO {
        return {
            id: t.id,
            title: t.name,
            description: t.description ?? "",
            status: t.stage_id?.[1] ?? "Unknown",
            priority: t.priority === "2" ? "HIGH" : t.priority === "1" ? "MEDIUM" : "LOW",
            tags: (t.tag_ids ?? []).map((id: number) => tagMap[id] ?? String(id)),
            timeSpent: t.close_hours ?? 0,
            createDate: t.create_date ?? "",
            updateDate: t.write_date ?? "",
            partnerName: t.partner_name ?? "",
            teamId: t.team_id?.[1] ?? "",
        };
    }
}