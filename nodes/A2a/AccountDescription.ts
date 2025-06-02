import { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Account',
				value: 'get',
				description: 'Get details of a specific account',
				action: 'Get an account',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/accounts/{{$parameter["accountId"]}}',
					},
				},
			},
			{
				name: 'List Accounts',
				value: 'getMany',
				description: 'Get a list of accounts',
				action: 'Get many accounts',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/accounts',
					},
				},
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get account balance',
				action: 'Get account balance',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/accounts/{{$parameter["accountId"]}}/balance',
					},
				},
			},
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get account transaction history',
				action: 'Get account transactions',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/accounts/{{$parameter["accountId"]}}/transactions',
					},
				},
			},
		],
		default: 'get',
	},
];

export const accountFields: INodeProperties[] = [
	// Get Account & Get Balance Fields
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['get', 'getBalance', 'getTransactions'],
			},
		},
		default: '',
		description: 'The ID of the account',
	},
	// List Accounts Fields
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMany'],
			},
		},
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Account Type',
		name: 'accountType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Checking',
				value: 'checking',
			},
			{
				name: 'Savings',
				value: 'savings',
			},
			{
				name: 'Business',
				value: 'business',
			},
		],
		default: '',
		routing: {
			send: {
				type: 'query',
				property: 'account_type',
			},
		},
		description: 'Filter accounts by type',
	},
	// Get Transactions Fields
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTransactions'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'query',
				property: 'start_date',
			},
		},
		description: 'Start date for transaction history (ISO 8601 format)',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTransactions'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'query',
				property: 'end_date',
			},
		},
		description: 'End date for transaction history (ISO 8601 format)',
	},
	{
		displayName: 'Transaction Limit',
		name: 'transactionLimit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTransactions'],
			},
		},
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
		},
		description: 'Maximum number of transactions to return',
	},
];
