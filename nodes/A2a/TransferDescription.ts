import { INodeProperties } from 'n8n-workflow';

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
			},
		},
		options: [
			{
				name: 'Create Transfer',
				value: 'create',
				description: 'Create a new account-to-account transfer',
				action: 'Create a transfer',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/transfers',
					},
				},
			},
			{
				name: 'Get Transfer',
				value: 'get',
				description: 'Get details of a specific transfer',
				action: 'Get a transfer',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/transfers/{{$parameter["transferId"]}}',
					},
				},
			},
			{
				name: 'List Transfers',
				value: 'getMany',
				description: 'Get a list of transfers',
				action: 'Get many transfers',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/transfers',
					},
				},
			},
			{
				name: 'Cancel Transfer',
				value: 'cancel',
				description: 'Cancel a pending transfer',
				action: 'Cancel a transfer',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/transfers/{{$parameter["transferId"]}}/cancel',
					},
				},
			},
		],
		default: 'create',
	},
];

export const transferFields: INodeProperties[] = [
	// Create Transfer Fields
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: 0,
		typeOptions: {
			numberPrecision: 2,
			minValue: 0.01,
		},
		routing: {
			send: {
				type: 'body',
				property: 'amount',
			},
		},
		description: 'Transfer amount in the specified currency',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'USD',
				value: 'USD',
			},
			{
				name: 'EUR',
				value: 'EUR',
			},
			{
				name: 'GBP',
				value: 'GBP',
			},
			{
				name: 'BRL',
				value: 'BRL',
			},
		],
		default: 'USD',
		routing: {
			send: {
				type: 'body',
				property: 'currency',
			},
		},
		description: 'Currency of the transfer',
	},
	{
		displayName: 'From Account ID',
		name: 'fromAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'from_account_id',
			},
		},
		description: 'Source account identifier',
	},
	{
		displayName: 'To Account ID',
		name: 'toAccountId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'to_account_id',
			},
		},
		description: 'Destination account identifier',
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'reference',
			},
		},
		description: 'Optional reference for the transfer',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['create'],
			},
		},
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'description',
			},
		},
		description: 'Optional description for the transfer',
	},
	// Get Transfer Fields
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['get', 'cancel'],
			},
		},
		default: '',
		description: 'The ID of the transfer to retrieve or cancel',
	},
	// List Transfers Fields
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['transfer'],
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
		displayName: 'Status',
		name: 'status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'All',
				value: '',
			},
			{
				name: 'Cancelled',
				value: 'cancelled',
			},
			{
				name: 'Completed',
				value: 'completed',
			},
			{
				name: 'Failed',
				value: 'failed',
			},
			{
				name: 'Pending',
				value: 'pending',
			},
		],
		default: '',
		routing: {
			send: {
				type: 'query',
				property: 'status',
			},
		},
		description: 'Filter transfers by status',
	},
];
