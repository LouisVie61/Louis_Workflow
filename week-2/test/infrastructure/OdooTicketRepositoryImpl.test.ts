import { OdooTicketRepositoryImpl } from '../../src/infrastructure/adapter/OdooTicketRepositoryImpl';
import { IHTTPAdapter } from '../../src/application/port/OutboundPort/IHTTPAdapter';

const mockTicketRaw = {
    id: 1,
    name: "Login issue",
    description: "Cannot login to the system",
    stage_id: [1, "New"],
    priority: "1",
    tag_ids: [10, 20],
    time_spent: 1.5,
    create_date: "2026-03-05 10:00:00",
    partner_name: "MindX",
    team_id: [1, "Support"],
};

describe('OdooTicketRepositoryImpl', () => {
    let mockHttp: jest.Mocked<IHTTPAdapter>;
    let repo: OdooTicketRepositoryImpl;

    beforeEach(() => {
        mockHttp = { post: jest.fn() };
        repo = new OdooTicketRepositoryImpl(
            'http://localhost:8069', 'testdb', 'admin', 'admin', mockHttp
        );
    });

    describe('listTickets', () => {
        it('should authenticate then return all tickets', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [mockTicketRaw] });

            const tickets = await repo.listTickets();

            expect(mockHttp.post).toHaveBeenCalledTimes(2);
            expect(mockHttp.post).toHaveBeenNthCalledWith(
                1,
                'http://localhost:8069/web/session/authenticate',
                expect.objectContaining({ params: expect.objectContaining({ db: 'testdb' }) })
            );
            expect(tickets).toHaveLength(1);
            expect(tickets[0]).toMatchObject({
                id: 1,
                title: 'Login issue',
                status: 'New',
                priority: 'MEDIUM',
                tags: ['10', '20'],
                timeSpent: 1.5,
                partnerName: 'MindX',
            });
        });

        it('should reuse uid on subsequent calls without re-authenticating', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [mockTicketRaw] })
                .mockResolvedValueOnce({ result: [mockTicketRaw] });

            await repo.listTickets();
            await repo.listTickets();

            expect(mockHttp.post).toHaveBeenCalledTimes(3);
        });
    });

    describe('getTicketById', () => {
        it('should return ticket when found', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [mockTicketRaw] });

            const ticket = await repo.getTicketById(1);
            expect(ticket.id).toBe(1);
            expect(ticket.title).toBe('Login issue');
        });

        it('should throw error when ticket not found', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [] });

            await expect(repo.getTicketById(999)).rejects.toThrow('Ticket #999 not found');
        });
    });

    describe('authenticate', () => {
        it('should throw when Odoo returns no uid', async () => {
            mockHttp.post.mockResolvedValueOnce({ result: null });

            await expect(repo.listTickets()).rejects.toThrow('Odoo authentication failed');
        });
    });

    describe('getNewTickets', () => {
        it('should query tickets created in last 24h', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [] });

            await repo.getNewTickets();

            const searchCall = mockHttp.post.mock.calls[1][1] as any;
            const domain = searchCall.params.args[0];
            expect(domain[0][0]).toBe('create_date');
            expect(domain[0][1]).toBe('>=');
        });
    });

    describe('getUnprocessedTickets', () => {
        it('should query tickets with stage New', async () => {
            mockHttp.post
                .mockResolvedValueOnce({ result: { uid: 42 } })
                .mockResolvedValueOnce({ result: [] });

            await repo.getUnprocessedTickets();

            const searchCall = mockHttp.post.mock.calls[1][1] as any;
            expect(searchCall.params.args[0]).toEqual([['stage_id.name', '=', 'New']]);
        });
    });

    describe('mapToDTO priority mapping', () => {
        const cases = [
            { raw: "2", expected: "HIGH" },
            { raw: "1", expected: "MEDIUM" },
            { raw: "0", expected: "LOW" },
        ];

        cases.forEach(({ raw, expected }) => {
            it(`should map priority "${raw}" to "${expected}"`, async () => {
                mockHttp.post
                    .mockResolvedValueOnce({ result: { uid: 42 } })
                    .mockResolvedValueOnce({ result: [{ ...mockTicketRaw, priority: raw }] });

                const tickets = await repo.listTickets();
                expect(tickets[0].priority).toBe(expected);
            });
        });
    });
});