# Agent2Agent Protocol Documentation

## Overview

The Agent2Agent (A2A) protocol is an open standard created by Google to enable communication and interoperability between agent applications. This n8n node implements the Agent2Agent protocol, allowing n8n workflows to communicate with A2A-compatible agents.

## Protocol Resources

- **Google A2A Repository**: [google/A2A](https://github.com/google/A2A)
- **Google Developers Blog**: [A2A Announcement](https://developers.googleblog.com/agent2agent)
- **Protocol Specification**: [A2A Testing Lab](https://a2a.to/)

## Communication Methods

### 1. Standard HTTP (tasks/send)

Sends a request and receives the complete response after the agent has finished processing.

**Features:**
- Single HTTP request with complete response
- Wait for agent to finish all processing
- Best for simple and quick tasks
- Simpler implementation

**Use Cases:**
- Simple API integrations
- Quick queries
- Batch processing

### 2. Streaming (tasks/sendSubscribe)

Uses Server-Sent Events (SSE) to provide real-time updates while the agent processes the request.

**Features:**
- Partial responses in real-time
- Instant feedback for users
- Best for chat interfaces and long responses
- Better user experience for complex tasks

**Use Cases:**
- Chat interfaces
- Long-running analyses
- Real-time content generation

## JSON-RPC 2.0 Implementation

The A2A protocol uses JSON-RPC 2.0 for communication. The n8n node handles the JSON-RPC formatting automatically.

### Request Structure

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
          "text": "Your question here"
        }
      ]
    },
    "sessionId": "unique-session-id",
    "id": "unique-task-id"
  },
  "id": "unique-call-id"
}
```

### Response Structure

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
            "text": "Agent response content..."
          }
        ]
      }
    }
  },
  "id": "unique-call-id"
}
```

#### Error Response
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal error",
    "data": {
      "details": "Additional error information"
    }
  },
  "id": "unique-call-id"
}
```

## Node Operations

### Send Message

Sends a message to an agent and waits for the complete response.

```javascript
{
  "resource": "agent",
  "operation": "send",
  "agentUrl": "https://your-agent.example.com",
  "message": "Hello, can you help me?",
  "sessionId": "optional-session-id",
  "taskId": "optional-task-id"
}
```

### Send Message with Streaming

Sends a message and receives streaming updates.

```javascript
{
  "resource": "agent",
  "operation": "sendSubscribe",
  "agentUrl": "https://your-agent.example.com", 
  "message": "Please provide detailed analysis...",
  "sessionId": "optional-session-id",
  "taskId": "optional-task-id",
  "additionalOptions": {
    "timeout": 60000,
    "role": "user"
  }
}
```

### Get Agent Card

Retrieves agent capabilities and metadata from the `.well-known/agent-card` endpoint.

```javascript
{
  "resource": "agent",
  "operation": "getAgentCard",
  "agentUrl": "https://your-agent.example.com"
}
```

## Agent Card Format

Agent cards provide metadata about agent capabilities:

```json
{
  "name": "Weather Agent",
  "description": "Provides weather information and forecasts",
  "version": "1.0.0",
  "capabilities": [
    "weather-current",
    "weather-forecast",
    "weather-alerts"
  ],
  "endpoints": {
    "tasks": "/api/v1/tasks"
  },
  "authentication": {
    "type": "bearer",
    "required": true
  },
  "rateLimit": {
    "requests": 100,
    "period": "hour"
  }
}
```

## Authentication

Agent authentication varies by implementation. Common methods:

### Bearer Token
```javascript
{
  "additionalOptions": {
    "headers": {
      "parameter": [
        {
          "name": "Authorization",
          "value": "Bearer your-token-here"
        }
      ]
    }
  }
}
```

### API Key
```javascript
{
  "additionalOptions": {
    "headers": {
      "parameter": [
        {
          "name": "X-API-Key",
          "value": "your-api-key-here"
        }
      ]
    }
  }
}
```

## Error Handling

### Common Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON was received |
| -32600 | Invalid Request | JSON-RPC request is not valid |
| -32601 | Method not found | Method does not exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Internal JSON-RPC error |
| -32000 to -32099 | Server error | Implementation-defined server errors |

### Retry Logic

The node implements automatic retry logic for transient failures:

```javascript
{
  "additionalOptions": {
    "timeout": 30000,
    "maxRetries": 3,
    "retryDelay": 1000
  }
}
```

## Best Practices

### Session Management

- Use consistent session IDs for related conversations
- Generate unique task IDs for each request
- Include relevant context in messages

### Performance Optimization

- Use streaming for long-running tasks
- Implement appropriate timeouts
- Cache agent cards when possible

### Security

- Validate agent URLs before making requests
- Use HTTPS endpoints only
- Implement proper authentication
- Never expose sensitive data in logs

## Example Workflows

### Basic Agent Communication

```json
{
  "nodes": [
    {
      "name": "Get Agent Info",
      "type": "n8n-nodes-a2a",
      "parameters": {
        "resource": "agent",
        "operation": "getAgentCard",
        "agentUrl": "https://weather-agent.example.com"
      }
    },
    {
      "name": "Ask Weather",
      "type": "n8n-nodes-a2a", 
      "parameters": {
        "resource": "agent",
        "operation": "send",
        "agentUrl": "https://weather-agent.example.com",
        "message": "What's the weather like in São Paulo?",
        "sessionId": "weather-session-001"
      }
    }
  ]
}
```

### Streaming Analysis

```json
{
  "nodes": [
    {
      "name": "Streaming Analysis",
      "type": "n8n-nodes-a2a",
      "parameters": {
        "resource": "agent", 
        "operation": "sendSubscribe",
        "agentUrl": "https://analysis-agent.example.com",
        "message": "Analyze the market trends for Q4 2024",
        "sessionId": "analysis-session-001",
        "additionalOptions": {
          "timeout": 120000,
          "role": "user",
          "includeMetadata": true
        }
      }
    }
  ]
}
```

## Testing and Development

### Local Testing

For development, you can create a simple A2A-compatible agent server:

```javascript
// Simple Express.js A2A agent
app.post('/api/tasks', (req, res) => {
  const { jsonrpc, method, params, id } = req.body;
  
  if (method === 'tasks/send') {
    res.json({
      jsonrpc: '2.0',
      result: {
        status: {
          message: {
            parts: [{
              type: 'text',
              text: `Echo: ${params.message.parts[0].text}`
            }]
          }
        }
      },
      id
    });
  }
});

app.get('/.well-known/agent-card', (req, res) => {
  res.json({
    name: 'Test Agent',
    description: 'Simple test agent for development',
    version: '1.0.0',
    capabilities: ['echo'],
    endpoints: { tasks: '/api/tasks' }
  });
});
```

### Testing Tools

- **Postman**: Test agent endpoints directly
- **curl**: Command-line testing
- **n8n Test Workflow**: Use the provided example workflow

## Troubleshooting

### Common Issues

1. **Agent Not Responding**
   - Check agent URL is accessible
   - Verify agent-card endpoint exists
   - Check network connectivity

2. **Authentication Errors**
   - Verify API keys/tokens
   - Check header format
   - Ensure proper permissions

3. **Timeout Issues**
   - Increase timeout values
   - Use streaming for long operations
   - Check agent performance

4. **JSON-RPC Errors**
   - Validate request format
   - Check method names
   - Verify parameter structure

### Debug Mode

Enable debug logging in n8n to see detailed request/response information:

```bash
N8N_LOG_LEVEL=debug n8n start
```

## Contributing

To add new A2A protocol features:

1. Update `AgentDescription.ts` with new operations
2. Implement handlers in `A2a.node.ts`
3. Add tests and documentation
4. Submit pull request

## Resources

- [Google A2A GitHub](https://github.com/google/A2A)
- [A2A Testing Lab](https://a2a.to/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [n8n Community Forum](https://community.n8n.io/) 
