# A2A Node Installation and Configuration Guide for n8n

This document provides detailed instructions for installing and configuring the A2A node in your n8n environment.

## Prerequisites

- n8n version 1.0.0 or higher
- Node.js 20.15 or higher
- npm or yarn

## Installation

### 1. Install via npm (Recommended)

```bash
npm install n8n-nodes-a2a
```

### 2. Local Installation for Development

```bash
# Clone the repository
git clone https://github.com/your-username/n8n-nodes-a2a.git
cd n8n-nodes-a2a

# Install dependencies
npm install

# Build the project
npm run build

# Link locally (optional for development)
npm link
```

### 3. Installation on n8n Self-hosted

If you're running n8n locally, add the node to your `package.json`:

```json
{
  "dependencies": {
    "n8n-nodes-a2a": "^0.1.0"
  }
}
```

### 4. Installation on n8n Community Edition

To install on an n8n Community Edition instance:

1. Access n8n settings
2. Go to "Community Nodes"
3. Click "Install"
4. Enter: `n8n-nodes-a2a`
5. Click "Install"

## Credentials Configuration

### Creating A2A Credentials

1. In n8n, go to **Credentials** → **Create New**
2. Search for "A2A API" in the list
3. Fill in the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| **API Key** | Your A2A API key | `ak_live_1234567890abcdef` |
| **API Secret** | Your A2A API secret | `as_live_0987654321fedcba` |
| **Environment** | Environment (Sandbox/Production) | `sandbox` |
| **Base URL** | API base URL | `https://api-sandbox.a2a.com` |

### Testing Credentials

1. After filling the fields, click **Test**
2. If successful, you'll see "Connection successful"
3. Click **Save** to save the credentials

## Using the A2A Node

### Transfer Operations

#### Create a Transfer

```javascript
// Configuration example
{
  "resource": "transfer",
  "operation": "create",
  "amount": 100.50,
  "currency": "USD", 
  "fromAccountId": "acc_123456789",
  "toAccountId": "acc_987654321",
  "reference": "Service payment",
  "description": "Monthly service payment"
}
```

#### Get Transfer Status

```javascript
{
  "resource": "transfer",
  "operation": "get",
  "transferId": "{{ $json.transfer_id }}"
}
```

#### List Transfers

```javascript
{
  "resource": "transfer", 
  "operation": "getMany",
  "limit": 50,
  "status": "completed"
}
```

### Account Operations

#### Check Balance

```javascript
{
  "resource": "account",
  "operation": "getBalance", 
  "accountId": "acc_123456789"
}
```

#### List Accounts

```javascript
{
  "resource": "account",
  "operation": "getMany",
  "limit": 50,
  "accountType": "checking"
}
```

#### Transaction History

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

## Example Workflow

See the `examples/A2A_Example_Workflow.json` file for a complete example workflow that demonstrates:

1. Creating a transfer
2. Checking transfer status
3. Querying source account balance

To import the example:
1. Copy the JSON file content
2. In n8n, go to **Workflows** → **Import from JSON**
3. Paste the content and click **Import**

## Troubleshooting

### Authentication Error

```
Error: Unauthorized (401)
```

**Solutions:**
- Verify your credentials are correct
- Confirm you're using the correct environment (sandbox/production)
- Check if the API key hasn't expired

### Account Not Found Error

```
Error: Account not found (404)
```

**Solutions:**
- Verify the account ID is correct
- Confirm the account exists in the selected environment
- Check your API key permissions

### Insufficient Funds Error

```
Error: Insufficient funds (400)
```

**Solutions:**
- Check the source account balance
- Confirm there are sufficient funds for the transfer
- Consider fees that may apply

### Rate Limit Error

```
Error: Too Many Requests (429)
```

**Solutions:**
- Wait before making more requests
- Implement exponential backoff in your workflows
- Contact support if you need higher rate limits

## Advanced Configuration

### Custom Error Handling

You can implement custom error handling in your workflows:

```javascript
// Example error handling in a workflow
if ($json.error) {
  switch ($json.error.code) {
    case 401:
      return { error: "Authentication failed" };
    case 404:
      return { error: "Resource not found" };
    case 429:
      return { error: "Rate limit exceeded" };
    default:
      return { error: "Unknown error occurred" };
  }
}
```

### Batch Operations

For multiple transfers, create a loop in your workflow:

```javascript
// Process multiple transfers
const transfers = $input.all();
const results = [];

for (const transfer of transfers) {
  const result = await $nodeOperation.create({
    resource: "transfer",
    operation: "create",
    ...transfer
  });
  results.push(result);
}

return results;
```

### Environment Variables

You can use environment variables for sensitive data:

```bash
# Set in your environment
export A2A_API_KEY="your-api-key"
export A2A_API_SECRET="your-api-secret"
```

## Performance Tips

1. **Use appropriate limits**: Don't fetch more data than needed
2. **Implement caching**: Cache account information when possible
3. **Monitor rate limits**: Respect API rate limits
4. **Use webhooks**: For real-time updates when available

## Security Best Practices

1. **Secure credentials**: Never hardcode API keys in workflows
2. **Use environments**: Use sandbox for testing, production for live
3. **Monitor access**: Regularly review API key usage
4. **Rotate keys**: Periodically rotate your API keys

## Support

For additional support:

1. **Documentation**: Check the [official A2A API documentation](https://docs.a2a.com/api)
2. **Issues**: Report problems on [GitHub](https://github.com/your-username/n8n-nodes-a2a/issues)
3. **Community**: Join the [n8n community forum](https://community.n8n.io/)

## Updates

To check and install updates:

```bash
npm update n8n-nodes-a2a
```

Or in n8n Community Edition, periodically check the "Community Nodes" section for available updates.

## Version History

- **v0.1.0**: Initial release with transfer and account operations
- Support for multiple currencies (USD, EUR, GBP, BRL)
- Comprehensive error handling
- Example workflows included 
