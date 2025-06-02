import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { transferOperations, transferFields } from './TransferDescription';
import { accountOperations, accountFields } from './AccountDescription';

export class A2a implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'A2A',
		name: 'a2a',
		icon: { light: 'file:a2a.svg', dark: 'file:a2a.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Account to Account operations for transfers and account management',
		defaults: {
			name: 'A2A',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'a2aApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Perform account-to-account transfers',
					},
					{
						name: 'Account',
						value: 'account',
						description: 'Manage account operations',
					},
				],
				default: 'transfer',
			},
			...transferOperations,
			...transferFields,
			...accountOperations,
			...accountFields,
		],
	};
}
