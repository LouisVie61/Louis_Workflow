export interface IInvestigateMetrics {
    checkAzureInsights(): Promise<boolean>;
    checkOdooInsights(): Promise<boolean>;
    checkApplicationLogs(): Promise<boolean>;
    checkDatabaseMetrics(): Promise<boolean>;
}