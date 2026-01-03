import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class TranscriptLolTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Transcript.lol Trigger',
		name: 'transcriptLolTrigger',
		icon: 'file:transcript-lol.png',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a Transcript.lol event occurs',
		defaults: {
			name: 'Transcript.lol Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'transcriptLolOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'TRANSCRIPT_CREATED',
				options: [
					{
						name: 'New Transcript',
						value: 'TRANSCRIPT_CREATED',
						description: 'Triggers when a transcript is completed for a recording',
					},
					{
						name: 'Transcript Failed',
						value: 'TRANSCRIPT_FAILED',
						description: 'Triggers when a transcript fails to be created',
					},
					{
						name: 'New Insights',
						value: 'INSIGHT_CREATED',
						description: 'Triggers when new AI insights are generated for a recording',
					},
					{
						name: 'Translation Created',
						value: 'TRANSLATION_CREATED',
						description: 'Triggers when a translation is completed for a recording',
					},
				],
			},
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the workspace to monitor for events',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						event: ['TRANSCRIPT_CREATED'],
					},
				},
				options: [
					{
						displayName: 'Transcript Format',
						name: 'format',
						type: 'options',
						default: 'text',
						description: 'Format to retrieve the transcript in',
						options: [
							{ name: 'JSON', value: 'json' },
							{ name: 'Plain Text', value: 'text' },
							{ name: 'CSV', value: 'csv' },
							{ name: 'Word Document', value: 'word' },
							{ name: 'Subtitle (SRT)', value: 'srt' },
							{ name: 'Subtitle (VTT)', value: 'vtt' },
						],
					},
					{
						displayName: 'Include Transcript Content',
						name: 'includeTranscript',
						type: 'boolean',
						default: true,
						description: 'Whether to fetch and include the full transcript content',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'transcriptLolOAuth2Api',
						{
							method: 'GET' as IHttpRequestMethods,
							url: `https://transcript.lol/api/v1/webhooks`,
							json: true,
						},
					);
					return true;
				} catch {
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const workspaceId = this.getNodeParameter('workspaceId') as string;

				const body = {
					event,
					workspaceId,
					url: webhookUrl,
					type: 'N8N',
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'transcriptLolOAuth2Api',
					{
						method: 'POST' as IHttpRequestMethods,
						url: 'https://transcript.lol/api/v1/webhooks',
						body,
						json: true,
					},
				);

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'DELETE' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/webhooks/${webhookData.webhookId}`,
								json: true,
							},
						);
					} catch {
						return false;
					}

					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as {
			event: string;
			data: {
				recordingId: string;
				workspaceId?: string;
				insightId?: string;
				translationId?: string;
			};
		};
		const event = this.getNodeParameter('event') as string;
		const workspaceId = this.getNodeParameter('workspaceId') as string;

		// Get recording details
		let recordingData: Record<string, any> = {};
		let transcriptData: Record<string, any> = {};
		let insightsData: any[] = [];

		if (body.data?.recordingId) {
			try {
				recordingData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'transcriptLolOAuth2Api',
					{
						method: 'GET' as IHttpRequestMethods,
						url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings/${body.data.recordingId}`,
						json: true,
					},
				);
			} catch {
				// Recording might not exist or be accessible
			}

			// For TRANSCRIPT_CREATED, also fetch the transcript
			if (event === 'TRANSCRIPT_CREATED') {
				const options = this.getNodeParameter('options', {}) as {
					format?: string;
					includeTranscript?: boolean;
				};

				if (options.includeTranscript !== false) {
					const format = options.format || 'text';
					try {
						transcriptData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings/${body.data.recordingId}/transcript`,
								qs: { format },
								json: format === 'json',
							},
						);
					} catch {
						// Transcript might not be available
					}
				}
			}

			// For INSIGHT_CREATED, fetch insights
			if (event === 'INSIGHT_CREATED') {
				try {
					insightsData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'transcriptLolOAuth2Api',
						{
							method: 'GET' as IHttpRequestMethods,
							url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings/${body.data.recordingId}/insights`,
							json: true,
						},
					);
				} catch {
					// Insights might not be available
				}
			}
		}

		const returnData: Record<string, any> = {
			event: body.event,
			recordingId: body.data?.recordingId,
			recording: recordingData,
		};

		if (event === 'TRANSCRIPT_CREATED' && Object.keys(transcriptData).length > 0) {
			returnData.transcript = transcriptData;
		}

		if (event === 'INSIGHT_CREATED' && insightsData.length > 0) {
			returnData.insights = insightsData;
		}

		if (event === 'TRANSLATION_CREATED' && body.data?.translationId) {
			returnData.translationId = body.data.translationId;
		}

		return {
			workflowData: [this.helpers.returnJsonArray([returnData])],
		};
	}
}
