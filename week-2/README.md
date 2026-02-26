# Ticket Manager CLI

## Installation

```bash
cd week-2
npm install
```


## Usage

```bash
# Create a ticket
npx ts-node index.ts tickets create <title> <description> [status] [priority] [tags]
npx ts-node index.ts tickets create "Fix bug" "Login page broken" OPEN HIGH bug,login

# List all tickets
npx ts-node index.ts tickets list

# Show ticket detail
npx ts-node index.ts tickets show <id>
npx ts-node index.ts tickets show 1

# Update ticket
npx ts-node index.ts tickets update <id> [--status <status>] [--priority <priority>]
npx ts-node index.ts tickets update 1 --status IN_PROGRESS
npx ts-node index.ts tickets update 1 --status DONE --priority LOW
```

## Available Values

| Field | Values |
|---|---|
| status | `OPEN` \| `IN_PROGRESS` \| `DONE` \| `CLOSED` |
| priority | `HIGH` \| `MEDIUM` \| `LOW` |

## Run Tests

```bash
npm test
```