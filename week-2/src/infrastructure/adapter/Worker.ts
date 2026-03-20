import { LoginProbAutomationUseCase } from "../../application/port/InboundPort/LoginProbAutomationUseCase";
import { OdooTicketUseCase } from "../../application/port/InboundPort/OdooTicketUseCase";

export class Worker {
    private isRunning = false;

    constructor(
        private readonly loginProbUseCase: LoginProbAutomationUseCase,
        private readonly odooUseCase: OdooTicketUseCase
    ) {}

    async run(): Promise<void> {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log("Worker started...");

        try {
            // Started get data
            let unprocessedTickets = await this.odooUseCase.getUnprocessedTickets();
            let tickets = await this.odooUseCase.filterLoginProbTickets(unprocessedTickets);
            console.log(`[Worker] Found ${tickets.length} login tickets`);
            await this.loginProbUseCase.processTicket(tickets);
            console.log(`[Worker] Processed ${tickets.length} tickets`);
        } catch (error) {
            console.error("Error occurred while running worker:", error);
        } finally {
            this.isRunning = false;
            console.log("Worker stopped.");
        }
    }

    async start(intervalMs: number = 5000): Promise<void> {
        console.log("Worker loop started...");

        while (true) {
            try {
                await this.run();
            } catch (e) {
                console.error("Worker loop error:", e);
            }

            await new Promise(res => setTimeout(res, intervalMs));
        }
    }
}