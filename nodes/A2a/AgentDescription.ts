import type { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Send Message',
				value: 'send',
				description: 'Send a message to an agent and get complete response (tasks/send)',
				action: 'Send a message to an agent',
			},
			{
				name: 'Send Message with Streaming',
				value: 'sendSubscribe',
				description: 'Send a message to an agent with streaming response (tasks/sendSubscribe)',
				action: 'Send a message with streaming response',
			},
			{
				name: 'Get Agent Card',
				value: 'getAgentCard',
				description: 'Get agent capabilities and information from .well-known/agent-card',
				action: 'Get agent card information',
			},
		],
		default: 'send',
	},
];

export const agentFields: INodeProperties[] = [
	// Fields for send operation
	{
		displayName: 'Agent URL',
		name: 'agentUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['send', 'sendSubscribe', 'getAgentCard'],
			},
		},
		default: '',
		placeholder: 'https://agent-api.example.com',
		description: 'The base URL of the A2A agent endpoint',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['send', 'sendSubscribe'],
			},
		},
		default: '',
		placeholder: 'Hello, can you help me with...',
		description: 'The message to send to the agent',
		typeOptions: {
			rows: 3,
		},
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['send', 'sendSubscribe'],
			},
		},
		default: '',
		placeholder: 'session-123',
		description: 'Optional session identifier for conversation context. If not provided, a unique session ID will be generated.',
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['send', 'sendSubscribe'],
			},
		},
		default: '',
		placeholder: 'task-456',
		description: 'Optional task identifier. If not provided, a unique task ID will be generated.',
	},
	// Additional options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['send', 'sendSubscribe'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Custom Headers',
				name: 'headers',
				type: 'fixedCollection',
				description: 'Additional headers to send with the request',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'parameter',
						displayName: 'Header',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								placeholder: 'X-Custom-Header',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'Custom Value',
							},
						],
					},
				],
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 30000,
				description: 'Request timeout in milliseconds',
				typeOptions: {
					minValue: 1000,
					maxValue: 300000,
				},
			},
			{
				displayName: 'Message Role',
				name: 'role',
				type: 'options',
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Assistant',
						value: 'assistant',
					},
					{
						name: 'System',
						value: 'system',
					},
				],
				default: 'user',
				description: 'The role of the message sender in the conversation',
			},
			{
				displayName: 'Include Metadata',
				name: 'includeMetadata',
				type: 'boolean',
				default: false,
				description: 'Whether to include additional metadata in the response',
			},
		],
	},
];
