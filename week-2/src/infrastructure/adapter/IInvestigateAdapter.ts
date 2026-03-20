import { IInvestigateMetrics } from "../../application/port/OutboundPort/IInvestigateMetrics";

export class IInvestigateAdapter implements IInvestigateMetrics {
    async checkAzureInsights(): Promise<boolean> {
        // if (Math.random() < 0.5) {
        //     throw new Error("Azure Insights check failed");
        // }
        return true;    
    }

    async checkOdooInsights(): Promise<boolean> {
        // if (Math.random() < 0.5) {
        //     throw new Error("Odoo Insights check failed");
        // }
        return true;
    }

    async checkApplicationLogs(): Promise<boolean> {
        // if (Math.random() < 0.5) {
        //     throw new Error("Application Logs check failed");
        // }
        return true;
    }

    async checkDatabaseMetrics(): Promise<boolean> {
        // if (Math.random() < 0.5) {
        //     throw new Error("Database Metrics check failed");
        // }
        return true;
    }
}