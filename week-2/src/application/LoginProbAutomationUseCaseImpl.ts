import { OdooEmail } from "./port/OutboundPort/OdooEmail";
import { LoginProbAutomationUseCase } from "./port/InboundPort/LoginProbAutomationUseCase";
import { OdooTicketRepository } from "./port/OutboundPort/TicketRepositoryNew";
import { OdooTicketDTO } from "./dto/OdooTicketDTO";
import { OdooTicketUseCase } from "./port/InboundPort/OdooTicketUseCase";
import { IInvestigateMetrics } from "./port/OutboundPort/IInvestigateMetrics";

export class LoginProbAutomationUseCaseImpl implements LoginProbAutomationUseCase {
    constructor (
        private readonly odooEmail: OdooEmail,
        private readonly odooRepo: OdooTicketRepository,
        private readonly investigateMetrics: IInvestigateMetrics
    ) {}

    async processTicket(tickets: OdooTicketDTO[]): Promise<void> {
        for (const ticket of tickets) {
            this.odooEmail.sendACKEmail(ticket.partnerEmail ?? "unknown", "Login Issue Received - Acknowledgment",
            "Dear Customer,\n\nWe have received your login issue ticket and our support team is currently investigating the problem. We will update you as soon as we have more information.\n\nBest regards,\nSupport Team");
        }
        
        const ticketsWithStatus = await Promise.all(
            tickets.map(async t => ({
                ticket: t,
                status: await this.odooRepo.getPartnerStatus(t.partnerId)
            }))
        );

        const ticketsWithActiveAcc = ticketsWithStatus
            .filter(t => t.status === "active")
            .map(t => t.ticket);

        const ticketsWithDeactiveAcc = ticketsWithStatus
            .filter(t => t.status === "deactive")
            .map(t => t.ticket);

        for (const ticket of ticketsWithDeactiveAcc) {
            await this.odooRepo.updateTicket(ticket.id, 'On Hold');
            await this.odooEmail.sendREEmail(String(ticket.partnerEmail), "Account Deactivated - Action Required", 
                "Dear Customer,\n\nWe have noticed that your account is currently deactivated. Please contact our support team to reactivate your account and resolve the login issues.\n\nBest regards,\nSupport Team");
        }

        for (const ticket of ticketsWithActiveAcc) {
            this.odooRepo.updateTicket(ticket.id, 'In Progress');

            const isSystemIssue =
                await this.investigateMetrics.checkAzureInsights() ||
                await this.investigateMetrics.checkOdooInsights() ||
                await this.investigateMetrics.checkApplicationLogs() ||
                await this.investigateMetrics.checkDatabaseMetrics();
            
                if (isSystemIssue) {
                    await this.odooRepo.updateTicket(ticket.id, undefined, 'HIGH');

                    const emailBody = `Dear Customer,

                        We are currently investigating the login issue you reported. In the meantime, please try resetting your password or clearing your browser cache. If the problem persists, please let us know.

                        Best regards,
                        Support Team
                        Ticket ID: #${ticket.id}`;

                    await this.odooEmail.sendREEmail(
                        String(ticket.partnerEmail), 
                        "Login Issue - Troubleshooting Steps", 
                        emailBody
                    );

                continue;
            }
            
            await this.odooEmail.sendFUEmail(String(ticket.partnerEmail), "Login Issue - Resolution Confirmation",
            "Dear Customer,\n\nWe have implemented a fix for the login issue you reported. Please try logging in again and let us know if the problem is resolved.\n\nBest regards,\nSupport Team");
            await this.odooRepo.updateTicket(ticket.id, 'closed');

            console.log(`[LoginAutomation] Ticket #${ticket.id}, partner=${ticket.partnerId}, status=${status}`);

        }
    }
}