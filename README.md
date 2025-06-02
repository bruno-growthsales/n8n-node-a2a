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

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

```bash
npm install n8n-nodes-a2a
```

## Operations

This node provides comprehensive A2A functionality through two main resources:

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

## Support

For support and questions:

1. **Documentation**: Check the [official A2A API docs](https://docs.a2a.com/api)
2. **Issues**: Report bugs on [GitHub Issues](https://github.com/your-username/n8n-nodes-a2a/issues)
3. **Community**: Join the [n8n community forum](https://community.n8n.io/)

## License

[MIT](https://github.com/your-username/n8n-nodes-a2a/blob/master/LICENSE.md)
