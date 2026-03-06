export interface OdooTicketDTO {   
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    tags: string[];
    timeSpent: number;
    createDate: string;
    partnerName: string;
    teamId: string;
};