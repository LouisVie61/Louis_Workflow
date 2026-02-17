Inside this folder, we will create entity and value objects.
Some videos taught me that we should have factory folder as a design pattern -> we need to check out

tickets with title, description, status, priority, tags
- title: string
- description: string
- status: StatusTicket -> process: the state of ticket (SOLD or not)
- priority: Priority -> process the level of ticket (HIGH || MEDIUM || LOW) -> decide the order

ValueObjects: defined by its value; immutable (unchange), identity-free (not like entity), encapsulates meaning

Initialize: ticketService
