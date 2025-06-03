import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { transferOperations, transferFields } from './TransferDescription';
import { accountOperations, accountFields } from './AccountDescription';
import { agentOperations, agentFields } from './AgentDescription';

export class A2a implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'A2A',
		name: 'a2a',
		icon: 'file:a2a.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'A2A (Account to Account) transfers, account management, and Agent2Agent protocol communication',
		defaults: {
			name: 'A2A',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'a2aApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer {{$credentials.apiKey}}',
				'X-API-Secret': '={{$credentials.apiSecret}}',
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
						description: 'Account to account transfers',
					},
					{
						name: 'Account',
						value: 'account',
						description: 'Account management operations',
					},
					{
						name: 'Agent',
						value: 'agent',
						description: 'Agent2Agent protocol communication',
					},
				],
				default: 'transfer',
			},
			...transferOperations,
			...transferFields,
			...accountOperations,
			...accountFields,
			...agentOperations,
			...agentFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'transfer') {
					// Transfer operations...
					if (operation === 'create') {
						const amount = this.getNodeParameter('amount', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const fromAccountId = this.getNodeParameter('fromAccountId', i) as string;
						const toAccountId = this.getNodeParameter('toAccountId', i) as string;
						const reference = this.getNodeParameter('reference', i, '') as string;
						const description = this.getNodeParameter('description', i, '') as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'POST',
								url: '/transfers',
								body: {
									amount,
									currency,
									fromAccountId,
									toAccountId,
									reference,
									description,
								},
							},
						);
					} else if (operation === 'get') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: `/transfers/${transferId}`,
							},
						);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const status = this.getNodeParameter('status', i, '') as string;

						const qs: any = { limit };
						if (status) {
							qs.status = status;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: '/transfers',
								qs,
							},
						);
					} else if (operation === 'cancel') {
						const transferId = this.getNodeParameter('transferId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'POST',
								url: `/transfers/${transferId}/cancel`,
							},
						);
					}
				} else if (resource === 'account') {
					// Account operations...
					if (operation === 'get') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: `/accounts/${accountId}`,
							},
						);
					} else if (operation === 'getMany') {
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const accountType = this.getNodeParameter('accountType', i, '') as string;

						const qs: any = { limit };
						if (accountType) {
							qs.type = accountType;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: '/accounts',
								qs,
							},
						);
					} else if (operation === 'getBalance') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: `/accounts/${accountId}/balance`,
							},
						);
					} else if (operation === 'getTransactions') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const startDate = this.getNodeParameter('startDate', i, '') as string;
						const endDate = this.getNodeParameter('endDate', i, '') as string;
						const transactionLimit = this.getNodeParameter('transactionLimit', i, 100) as number;

						const qs: any = { limit: transactionLimit };
						if (startDate) {
							qs.start_date = startDate;
						}
						if (endDate) {
							qs.end_date = endDate;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'a2aApi',
							{
								method: 'GET',
								url: `/accounts/${accountId}/transactions`,
								qs,
							},
						);
					}
				} else if (resource === 'agent') {
					// Agent2Agent protocol operations
					if (operation === 'send') {
						const message = this.getNodeParameter('message', i) as string;
						const sessionId = this.getNodeParameter('sessionId', i, '') as string;
						const taskId = this.getNodeParameter('taskId', i, '') as string;
						const agentUrl = this.getNodeParameter('agentUrl', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

						const requestId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

						const jsonRpcRequest = {
							jsonrpc: '2.0',
							method: 'tasks/send',
							params: {
								message: {
									role: additionalOptions.role || 'user',
									parts: [
										{
											type: 'text',
											text: message,
										},
									],
								},
								sessionId: sessionId || `session-${Date.now()}`,
								id: taskId || `task-${Date.now()}`,
							},
							id: requestId,
						};

						// Prepare headers
						const headers: any = {
							'Content-Type': 'application/json',
							Accept: 'application/json',
						};

						// Add custom headers if provided
						if (additionalOptions.headers?.parameter) {
							for (const header of additionalOptions.headers.parameter) {
								if (header.name && header.value) {
									headers[header.name] = header.value;
								}
							}
						}

						const requestOptions: any = {
							method: 'POST',
							url: agentUrl,
							headers,
							body: jsonRpcRequest,
						};

						// Add timeout if specified
						if (additionalOptions.timeout) {
							requestOptions.timeout = additionalOptions.timeout;
						}

						responseData = await this.helpers.httpRequest.call(this, requestOptions);
					} else if (operation === 'sendSubscribe') {
						const message = this.getNodeParameter('message', i) as string;
						const sessionId = this.getNodeParameter('sessionId', i, '') as string;
						const taskId = this.getNodeParameter('taskId', i, '') as string;
						const agentUrl = this.getNodeParameter('agentUrl', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

						const requestId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

						const jsonRpcRequest = {
							jsonrpc: '2.0',
							method: 'tasks/sendSubscribe',
							params: {
								message: {
									role: additionalOptions.role || 'user',
									parts: [
										{
											type: 'text',
											text: message,
										},
									],
								},
								sessionId: sessionId || `session-${Date.now()}`,
								id: taskId || `task-${Date.now()}`,
							},
							id: requestId,
						};

						// Prepare headers
						const headers: any = {
							'Content-Type': 'application/json',
							Accept: 'text/event-stream',
							'Cache-Control': 'no-cache',
						};

						// Add custom headers if provided
						if (additionalOptions.headers?.parameter) {
							for (const header of additionalOptions.headers.parameter) {
								if (header.name && header.value) {
									headers[header.name] = header.value;
								}
							}
						}

						const requestOptions: any = {
							method: 'POST',
							url: agentUrl,
							headers,
							body: jsonRpcRequest,
						};

						// Add timeout if specified
						if (additionalOptions.timeout) {
							requestOptions.timeout = additionalOptions.timeout;
						}

						responseData = await this.helpers.httpRequest.call(this, requestOptions);
					} else if (operation === 'getAgentCard') {
						const agentUrl = this.getNodeParameter('agentUrl', i) as string;
						const cardUrl = agentUrl.replace(/\/$/, '') + '/.well-known/agent-card';

						responseData = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: cardUrl,
							headers: {
								Accept: 'application/json',
							},
						});
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as INodeExecutionData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
