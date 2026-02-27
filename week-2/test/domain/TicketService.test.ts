import { TicketService } from '../../src/domain/Services/TicketService';
import { StatusTicket } from '../../src/domain/ValueObjects/StatusTicket';
import { PriorityTicket } from '../../src/domain/ValueObjects/PriorityTicket';
import { Tag } from '../../src/domain/ValueObjects/TagTicket';
import { Ticket } from '../../src/domain/entity/ticket';

describe('TicketService (pure domain)', () => {
  let service: TicketService;

  beforeEach(() => {
    service = new TicketService();
  });

  describe('generateId', () => {
    test('should return 1 when no tickets', () => {
      expect(service.generateId([])).toBe(1);
    });

    test('should return max id + 1', () => {
      const tickets = [
        new Ticket(1, 'T1', 'desc', new StatusTicket('OPEN'), new PriorityTicket('LOW'), []),
        new Ticket(3, 'T3', 'desc', new StatusTicket('OPEN'), new PriorityTicket('LOW'), []),
      ];
      expect(service.generateId(tickets)).toBe(4);
    });
  });

  describe('applyBusinessRules', () => {
    test('should add urgent tag when HIGH priority', () => {
      const ticket = new Ticket(1, 'T1', 'desc', new StatusTicket('OPEN'), new PriorityTicket('HIGH'), []);
      service.applyBusinessRules(ticket);
      expect(ticket.hasTag('urgent')).toBe(true);
    });
 
    test('should NOT duplicate urgent tag', () => {
      const ticket = new Ticket(1, 'T1', 'desc', new StatusTicket('OPEN'), new PriorityTicket('HIGH'), [new Tag('urgent')]);
      service.applyBusinessRules(ticket);
      expect(ticket.tags.filter(t => t.getValue() === 'urgent').length).toBe(1);
    });
  });

  describe('filterTickets', () => {
    const tickets = [
      new Ticket(1, 'T1', 'd1', new StatusTicket('OPEN'), new PriorityTicket('LOW'), []),
      new Ticket(2, 'T2', 'd2', new StatusTicket('DONE'), new PriorityTicket('HIGH'), []),
      new Ticket(3, 'T3', 'd3', new StatusTicket('OPEN'), new PriorityTicket('HIGH'), []),
    ];

    test('should filter by status', () => {
      const result = service.filterTickets(tickets, new StatusTicket('OPEN'));
      expect(result.length).toBe(2);
    });

    test('should return all when no filter', () => {
      expect(service.filterTickets(tickets).length).toBe(3);
    });
  });
});