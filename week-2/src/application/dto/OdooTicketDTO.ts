export interface OdooTicketDTO {   
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    tags: string[];
    timeSpent: number;
    createDate: string;
    updateDate: string;
    partnerName: string;
    teamId: string;
};