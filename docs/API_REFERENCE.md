# A2A Node API Reference

This document provides a comprehensive API reference for the A2A (Account to Account) node in n8n.

## Overview

The A2A node enables seamless integration with A2A APIs for account-to-account transfers and account management operations. It supports both sandbox and production environments with secure authentication.

## Authentication

### Credential Configuration

The A2A node uses API key-based authentication with the following parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | string | Yes | Your A2A API key |
| `apiSecret` | string | Yes | Your A2A API secret |
| `environment` | enum | Yes | `sandbox` or `production` |
| `baseUrl` | string | Auto | Automatically set based on environment |

### Environment URLs

- **Sandbox**: `https://api-sandbox.a2a.com`
- **Production**: `https://api.a2a.com`

## Resources

### Transfer Resource

Handles all transfer-related operations.

#### Operations

##### Create Transfer

Creates a new account-to-account transfer.

**Parameters:**
- `amount` (number, required): Transfer amount (minimum: 0.01)
- `currency` (enum, required): Currency code (`USD`, `EUR`, `GBP`, `BRL`)
- `fromAccountId` (string, required): Source account identifier
- `toAccountId` (string, required): Destination account identifier
- `reference` (string, optional): Reference for the transfer
- `description` (string, optional): Description of the transfer

**API Call:**
```
POST /v1/transfers
{
  "amount": 100.50,
  "currency": "USD",
  "from_account_id": "acc_123456789",
  "to_account_id": "acc_987654321",
  "reference": "Service Payment",
  "description": "Monthly service payment"
}
```

**Response Example:**
```json
{
  "transfer_id": "txn_1234567890",
  "status": "pending",
  "amount": 100.50,
  "currency": "USD",
  "from_account_id": "acc_123456789",
  "to_account_id": "acc_987654321",
  "reference": "Service Payment",
  "description": "Monthly service payment",
  "created_at": "2024-06-02T20:15:00Z"
}
```

##### Get Transfer

Retrieves details of a specific transfer.

**Parameters:**
- `transferId` (string, required): The ID of the transfer to retrieve

**API Call:**
```
GET /v1/transfers/{transferId}
```

**Response Example:**
```json
{
  "transfer_id": "txn_1234567890",
  "status": "completed",
  "amount": 100.50,
  "currency": "USD",
  "from_account_id": "acc_123456789",
  "to_account_id": "acc_987654321",
  "reference": "Service Payment",
  "description": "Monthly service payment",
  "created_at": "2024-06-02T20:15:00Z",
  "completed_at": "2024-06-02T20:16:30Z"
}
```

##### List Transfers

Retrieves a list of transfers with optional filtering.

**Parameters:**
- `limit` (number, optional): Maximum number of results (default: 50, max: 200)
- `status` (enum, optional): Filter by status (`all`, `cancelled`, `completed`, `failed`, `pending`)

**API Call:**
```
GET /v1/transfers?limit=50&status=completed
```

**Response Example:**
```json
{
  "transfers": [
    {
      "transfer_id": "txn_1234567890",
      "status": "completed",
      "amount": 100.50,
      "currency": "USD",
      "created_at": "2024-06-02T20:15:00Z"
    }
  ],
  "total": 1,
  "has_more": false
}
```

##### Cancel Transfer

Cancels a pending transfer.

**Parameters:**
- `transferId` (string, required): The ID of the transfer to cancel

**API Call:**
```
POST /v1/transfers/{transferId}/cancel
```

**Response Example:**
```json
{
  "transfer_id": "txn_1234567890",
  "status": "cancelled",
  "cancelled_at": "2024-06-02T20:17:00Z"
}
```

### Account Resource

Handles all account-related operations.

#### Operations

##### Get Account

Retrieves details of a specific account.

**Parameters:**
- `accountId` (string, required): The ID of the account

**API Call:**
```
GET /v1/accounts/{accountId}
```

**Response Example:**
```json
{
  "account_id": "acc_123456789",
  "account_type": "checking",
  "currency": "USD",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

##### List Accounts

Retrieves a list of accounts with optional filtering.

**Parameters:**
- `limit` (number, optional): Maximum number of results (default: 50, max: 200)
- `accountType` (enum, optional): Filter by type (`all`, `business`, `checking`, `savings`)

**API Call:**
```
GET /v1/accounts?limit=50&account_type=checking
```

##### Get Balance

Retrieves the current balance of an account.

**Parameters:**
- `accountId` (string, required): The ID of the account

**API Call:**
```
GET /v1/accounts/{accountId}/balance
```

**Response Example:**
```json
{
  "account_id": "acc_123456789",
  "available_balance": 1500.75,
  "pending_balance": 1450.25,
  "currency": "USD",
  "last_updated": "2024-06-02T20:15:00Z"
}
```

##### Get Transactions

Retrieves transaction history for an account.

**Parameters:**
- `accountId` (string, required): The ID of the account
- `startDate` (datetime, optional): Start date for filtering (ISO 8601 format)
- `endDate` (datetime, optional): End date for filtering (ISO 8601 format)
- `transactionLimit` (number, optional): Maximum number of transactions (default: 100, max: 500)

**API Call:**
```
GET /v1/accounts/{accountId}/transactions?start_date=2024-01-01T00:00:00Z&end_date=2024-12-31T23:59:59Z&limit=100
```

## Error Handling

### Common HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid parameters, insufficient funds |
| 401 | Unauthorized | Invalid or expired API credentials |
| 404 | Not Found | Account or transfer not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Account does not have sufficient funds for this transfer",
    "details": {
      "account_id": "acc_123456789",
      "available_balance": 50.00,
      "requested_amount": 100.50
    }
  }
}
```

### Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `INVALID_CREDENTIALS` | API credentials are invalid | Check API key and secret |
| `ACCOUNT_NOT_FOUND` | Account ID does not exist | Verify account ID |
| `INSUFFICIENT_FUNDS` | Not enough balance for transfer | Check account balance |
| `TRANSFER_NOT_FOUND` | Transfer ID does not exist | Verify transfer ID |
| `INVALID_CURRENCY` | Currency not supported | Use supported currency |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Implement rate limiting |

## Rate Limits

- **Sandbox**: 100 requests per minute
- **Production**: 1000 requests per minute

## Best Practices

### Security
1. Never hardcode API credentials in workflows
2. Use environment variables for sensitive data
3. Regularly rotate API keys
4. Monitor API usage and access logs

### Performance
1. Implement appropriate error handling
2. Use pagination for large datasets
3. Cache account information when possible
4. Respect rate limits

### Development
1. Always test in sandbox environment first
2. Use meaningful references and descriptions
3. Implement idempotency for critical operations
4. Log all API interactions for debugging

## Supported Currencies

| Currency | Code | Symbol |
|----------|------|--------|
| US Dollar | USD | $ |
| Euro | EUR | € |
| British Pound | GBP | £ |
| Brazilian Real | BRL | R$ |

## Support

For technical support:
- **API Documentation**: [https://docs.a2a.com/api](https://docs.a2a.com/api)
- **Support Portal**: [https://support.a2a.com](https://support.a2a.com)
- **Status Page**: [https://status.a2a.com](https://status.a2a.com) 
