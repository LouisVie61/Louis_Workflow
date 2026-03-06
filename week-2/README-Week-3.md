## Odoo Integration Setup

### Prerequisites

Requires a running Odoo instance with the Helpdesk module installed.

### Environment Configuration

Copy `.env.example` to `.env` and fill in your Odoo credentials:

```bash
ODOO_URL=http://your-odoo-instance:8069
ODOO_DB=your_database_name
ODOO_USERNAME=your_login_email
ODOO_API_KEY=your_api_key
```

## CLI Commands

### Lấy tất cả tickets
npx ts-node index.ts tickets list

### Lấy tickets mới (24h)
npx ts-node index.ts tickets new

### Lấy tickets chưa xử lý
npx ts-node index.ts tickets unprocessed

### Xem chi tiết ticket
npx ts-node index.ts tickets show <id>

## Data flow

```bash
CLI_command -> CLIAdapter.run() -> OdooTicketUseCase -> OdooTicketUseCaseImpl -> OdooTicketRepository -> IHTTPAdapter -> HTTPAdapter -> Odoo JSON-RPC API
```

## Create ticket via Postman
POST: https://personal121.odoo.com/jsonrpc
```bash
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "service": "object",
    "method": "execute_kw",
    "args": [
      "personal121",
      2,
      "Tan568993993",
      "helpdesk.ticket",
      "create",
      [
        {
          "name": "Testing",
          "description": "Testing.",
          "stage_id": 1,
          "priority": "2",
          "partner_name": "MindX Corp"
        }
      ]
    ]
  }
}
```