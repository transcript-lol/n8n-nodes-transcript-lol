import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class TranscriptLol implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Transcript.lol',
		name: 'transcriptLol',
		icon: 'file:transcript-lol.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create recordings and get transcripts from Transcript.lol',
		defaults: {
			name: 'Transcript.lol',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'transcriptLolOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://transcript.lol/api/v1',
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
						name: 'Recording',
						value: 'recording',
					},
					{
						name: 'Transcript',
						value: 'transcript',
					},
					{
						name: 'Workspace',
						value: 'workspace',
					},
				],
				default: 'recording',
			},
			// Recording Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['recording'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new recording for transcription',
						action: 'Create a recording',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a recording by ID',
						action: 'Get a recording',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many recordings from a workspace',
						action: 'Get many recordings',
					},
				],
				default: 'create',
			},
			// Transcript Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['transcript'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get transcript for a recording',
						action: 'Get a transcript',
					},
				],
				default: 'get',
			},
			// Workspace Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workspace'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get all workspaces',
						action: 'Get many workspaces',
					},
				],
				default: 'getMany',
			},
			// Fields for Recording Create
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['create', 'get', 'getMany'],
					},
				},
				default: '',
				description: 'The ID of the workspace',
			},
			{
				displayName: 'Recording ID',
				name: 'recordingId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the recording',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Title of the recording',
			},
			{
				displayName: 'Source URL',
				name: 'sourceUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'A public URL to fetch the recording media from',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['create'],
					},
				},
				default: 'en',
				description: 'Language of the audio',
				options: [
					{ name: 'Arabic', value: 'ar' },
					{ name: 'Bulgarian', value: 'bg' },
					{ name: 'Catalan', value: 'ca' },
					{ name: 'Chinese (Simplified)', value: 'zh' },
					{ name: 'Chinese (Simplified, China)', value: 'zh-CN' },
					{ name: 'Chinese (Traditional, Taiwan)', value: 'zh-TW' },
					{ name: 'Croatian', value: 'hr' },
					{ name: 'Czech', value: 'cs' },
					{ name: 'Danish', value: 'da' },
					{ name: 'Dutch', value: 'nl' },
					{ name: 'English', value: 'en' },
					{ name: 'English (Australia)', value: 'en-AU' },
					{ name: 'English (India)', value: 'en-IN' },
					{ name: 'English (UK)', value: 'en-GB' },
					{ name: 'English (US)', value: 'en-US' },
					{ name: 'Estonian', value: 'et' },
					{ name: 'Filipino', value: 'tl' },
					{ name: 'Finnish', value: 'fi' },
					{ name: 'Flemish', value: 'nl-BE' },
					{ name: 'French', value: 'fr' },
					{ name: 'French (Canada)', value: 'fr-CA' },
					{ name: 'Georgian', value: 'ka' },
					{ name: 'German', value: 'de' },
					{ name: 'German (Switzerland)', value: 'de-CH' },
					{ name: 'Greek', value: 'el' },
					{ name: 'Hebrew', value: 'he' },
					{ name: 'Hindi', value: 'hi' },
					{ name: 'Hungarian', value: 'hu' },
					{ name: 'Indonesian', value: 'id' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Kannada', value: 'kn' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Latvian', value: 'lv' },
					{ name: 'Lithuanian', value: 'lt' },
					{ name: 'Malay', value: 'ms' },
					{ name: 'Malayalam', value: 'ml' },
					{ name: 'Norwegian', value: 'no' },
					{ name: 'Norwegian Nynorsk', value: 'nn' },
					{ name: 'Persian', value: 'fa' },
					{ name: 'Polish', value: 'pl' },
					{ name: 'Portuguese', value: 'pt' },
					{ name: 'Portuguese (Brazil)', value: 'pt-BR' },
					{ name: 'Romanian', value: 'ro' },
					{ name: 'Russian', value: 'ru' },
					{ name: 'Slovak', value: 'sk' },
					{ name: 'Slovenian', value: 'sl' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'Spanish (Latin America)', value: 'es-419' },
					{ name: 'Swedish', value: 'sv' },
					{ name: 'Telugu', value: 'te' },
					{ name: 'Thai', value: 'th' },
					{ name: 'Turkish', value: 'tr' },
					{ name: 'Ukrainian', value: 'uk' },
					{ name: 'Urdu', value: 'ur' },
					{ name: 'Vietnamese', value: 'vi' },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['recording'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'External ID',
						name: 'externalId',
						type: 'string',
						default: '',
						description: 'Optional unique ID from your own system to identify this recording. Used to prevent duplicate recordings.',
					},
					{
						displayName: 'Metadata',
						name: 'externalMetadata',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Optional metadata to attach to the recording',
						options: [
							{
								name: 'metadataValues',
								displayName: 'Metadata',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
			},
			// Fields for Transcript Get
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the workspace',
			},
			{
				displayName: 'Recording ID',
				name: 'recordingId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the recording',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['transcript'],
						operation: ['get'],
					},
				},
				default: 'text',
				description: 'Format of the transcript output',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'Plain Text', value: 'text' },
					{ name: 'CSV', value: 'csv' },
					{ name: 'Word Document', value: 'word' },
					{ name: 'Subtitle (SRT)', value: 'srt' },
					{ name: 'Subtitle (VTT)', value: 'vtt' },
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'recording') {
					if (operation === 'create') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const sourceUrl = this.getNodeParameter('sourceUrl', i) as string;
						const language = this.getNodeParameter('language', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							externalId?: string;
							externalMetadata?: {
								metadataValues?: Array<{ key: string; value: string }>;
							};
						};

						const body: Record<string, any> = {
							title,
							language,
							mediaType: 'AUDIO',
							source: 'URL',
							sourceUrl,
						};

						if (additionalFields.externalId) {
							body.externalId = additionalFields.externalId;
						}

						if (additionalFields.externalMetadata?.metadataValues) {
							body.externalMetadata = additionalFields.externalMetadata.metadataValues;
						}

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'POST' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings`,
								body,
								json: true,
							},
						);
					} else if (operation === 'get') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const recordingId = this.getNodeParameter('recordingId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings/${recordingId}`,
								json: true,
							},
						);
					} else if (operation === 'getMany') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings`,
								json: true,
							},
						);
					}
				} else if (resource === 'transcript') {
					if (operation === 'get') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const recordingId = this.getNodeParameter('recordingId', i) as string;
						const format = this.getNodeParameter('format', i) as string;

						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'GET' as IHttpRequestMethods,
								url: `https://transcript.lol/api/v1/spaces/${workspaceId}/recordings/${recordingId}/transcript`,
								qs: { format },
								json: format === 'json',
							},
						);
					}
				} else if (resource === 'workspace') {
					if (operation === 'getMany') {
						responseData = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'transcriptLolOAuth2Api',
							{
								method: 'GET' as IHttpRequestMethods,
								url: 'https://transcript.lol/api/v1/spaces',
								json: true,
							},
						);
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((data) => ({ json: data })));
				} else if (responseData !== undefined) {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
