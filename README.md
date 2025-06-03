# n8n-nodes-a2a

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is an n8n community node that provides A2A (Account to Account) operations for transfers and account management.

A2A enables secure account-to-account transfers and comprehensive account management through a unified API interface.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage Examples](#usage-examples)  
[Resources](#resources)  

## 🚀 Installation

The A2A node can be installed using multiple methods:

### Option 1: Via npm (Recommended)

```bash
# In your n8n directory
npm install n8n-nodes-a2a

# Restart n8n
pm2 restart n8n
```

### Option 2: Automated Script

```bash
# Install from npm (default)
curl -fsSL https://raw.githubusercontent.com/your-username/n8n-nodes-a2a/main/install-a2a-node.sh | bash

# Install from GitHub
curl -fsSL https://raw.githubusercontent.com/your-username/n8n-nodes-a2a/main/install-a2a-node.sh | bash -s -- --github
```

### Option 3: Manual Installation from GitHub

```bash
# In your n8n directory
npm install https://github.com/your-username/n8n-nodes-a2a.git

# Restart n8n
pm2 restart n8n
```

### Option 4: Docker

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN cd /usr/local/lib/node_modules/n8n && \
    npm install n8n-nodes-a2a
USER node
```

For detailed installation instructions including troubleshooting, see:
- **Quick Guide**: [INSTALL_SELFHOST.md](INSTALL_SELFHOST.md)  
- **Detailed Guide**: [docs/N8N_SELFHOST_INSTALL.md](docs/N8N_SELFHOST_INSTALL.md)

## Operations

This node provides comprehensive A2A functionality through three main resources:

### Transfer Resource
- **Create Transfer**: Create a new account-to-account transfer
- **Get Transfer**: Get details of a specific transfer by ID
- **List Transfers**: Get a list of transfers with filtering options
- **Cancel Transfer**: Cancel a pending transfer

### Account Resource
- **Get Account**: Get details of a specific account
- **List Accounts**: Get a list of accounts with filtering options
- **Get Balance**: Get account balance information
- **Get Transactions**: Get account transaction history with date filtering

### Agent Resource (Google Agent2Agent Protocol)
- **Send Message**: Send a message to an agent and receive complete response (tasks/send)
- **Send Message with Streaming**: Send a message with real-time streaming response (tasks/sendSubscribe)
- **Get Agent Card**: Retrieve agent capabilities from .well-known/agent-card endpoint

## Credentials

You need to authenticate with the A2A API using the following credentials:

1. **API Key**: Your A2A API key
2. **API Secret**: Your A2A API secret  
3. **Environment**: Choose between Production or Sandbox
4. **Base URL**: Automatically set based on environment selection

### Setting up credentials

1. Sign up for an A2A account and obtain your API credentials
2. In n8n, create new credentials using the "A2A API" credential type
3. Enter your API Key and Secret
4. Select the appropriate environment (Sandbox for testing, Production for live operations)
5. Test the credentials to ensure they work correctly

## Usage Examples

### Creating a Transfer

```javascript
{
  "resource": "transfer",
  "operation": "create",
  "amount": 100.50,
  "currency": "USD",
  "fromAccountId": "acc_123456789",
  "toAccountId": "acc_987654321",
  "reference": "Service Payment",
  "description": "Monthly service payment"
}
```

### Checking Account Balance

```javascript
{
  "resource": "account",
  "operation": "getBalance",
  "accountId": "acc_123456789"
}
```

### Listing Recent Transfers

```javascript
{
  "resource": "transfer",
  "operation": "getMany",
  "limit": 50,
  "status": "completed"
}
```

### Getting Transaction History

```javascript
{
  "resource": "account",
  "operation": "getTransactions",
  "accountId": "acc_123456789",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "transactionLimit": 100
}
```

### Agent2Agent Protocol Examples

#### Send Standard Message

```javascript
{
  "resource": "agent",
  "operation": "send",
  "agentUrl": "https://agent-api.example.com",
  "message": "Hello! Can you help me with my query?",
  "sessionId": "session-123",
  "taskId": "task-456"
}
```

#### Send Message with Streaming

```javascript
{
  "resource": "agent",
  "operation": "sendSubscribe",
  "agentUrl": "https://agent-api.example.com",
  "message": "Please provide a detailed analysis...",
  "sessionId": "session-123",
  "taskId": "task-789",
  "additionalOptions": {
    "role": "user",
    "timeout": 60000,
    "headers": {
      "parameter": [
        {
          "name": "X-Custom-Header",
          "value": "custom-value"
        }
      ]
    }
  }
}
```

#### Get Agent Capabilities

```javascript
{
  "resource": "agent",
  "operation": "getAgentCard",
  "agentUrl": "https://agent-api.example.com"
}
```

### JSON-RPC 2.0 Protocol

The Agent resource implements the Google Agent2Agent protocol using JSON-RPC 2.0:

#### Request Format
```json
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "Your message here"
        }
      ]
    },
    "sessionId": "session-123",
    "id": "task-456"
  },
  "id": "call-789"
}
```

#### Success Response
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": {
      "message": {
        "parts": [
          {
            "type": "text",
            "text": "Agent response here..."
          }
        ]
      }
    }
  },
  "id": "call-789"
}
```

#### Error Response
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Error message"
  },
  "id": "call-789"
}
```

## Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- BRL (Brazilian Real)

## Error Handling

The node includes comprehensive error handling for common scenarios:

- **401 Unauthorized**: Invalid API credentials
- **404 Not Found**: Account or transfer not found
- **400 Bad Request**: Invalid parameters or insufficient funds
- **429 Rate Limited**: Too many requests

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Node.js version**: 20.15+
- **Tested with n8n versions**: 1.0.0+

## Development

### Prerequisites

- Node.js 20.15 or higher
- npm or yarn
- n8n installed globally

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lintfix  # Auto-fix issues
```

### Development Mode

```bash
npm run dev  # Watch mode for development
```

### Project Structure

```
n8n-nodes-a2a/
├── credentials/
│   └── A2aApi.credentials.ts     # API credentials definition
├── nodes/
│   └── A2a/
│       ├── A2a.node.ts          # Main node implementation
│       ├── TransferDescription.ts # Transfer operations
│       ├── AccountDescription.ts  # Account operations
│       ├── a2a.svg              # Node icon
│       └── A2a.node.json        # Node metadata
├── examples/
│   └── A2A_Example_Workflow.json # Example workflow
└── docs/
    └── INSTALLATION.md           # Detailed installation guide
```

## Example Workflow

Import the example workflow from `examples/A2A_Example_Workflow.json` to see:

1. How to create a transfer
2. How to check transfer status
3. How to verify account balance
4. Error handling best practices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and build
6. Submit a pull request

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [A2A API Documentation](https://docs.a2a.com/api)
* [A2A Authentication Guide](https://docs.a2a.com/authentication)
* [Transfer API Reference](https://docs.a2a.com/transfers)
* [Account API Reference](https://docs.a2a.com/accounts)
* **Agent2Agent Protocol**:
  * [Google A2A Repository](https://github.com/google/A2A)
  * [A2A Testing Lab](https://a2a.to/)
  * [Agent2Agent Protocol Documentation](docs/AGENT2AGENT_PROTOCOL.md)
  * [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## Support

For support and questions:

1. **Documentation**: Check the [official A2A API docs](https://docs.a2a.com/api)
2. **Agent2Agent Protocol**: See [Agent2Agent Documentation](docs/AGENT2AGENT_PROTOCOL.md)
3. **Issues**: Report bugs on [GitHub Issues](https://github.com/bruno-growthsales/n8n-nodes-a2a/issues)
4. **Community**: Join the [n8n community forum](https://community.n8n.io/)

## License

[MIT](https://github.com/bruno-growthsales/n8n-nodes-a2a/blob/master/LICENSE.md)
