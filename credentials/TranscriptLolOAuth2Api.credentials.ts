import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TranscriptLolOAuth2Api implements ICredentialType {
	name = 'transcriptLolOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Transcript.lol OAuth2 API';
	documentationUrl = 'https://transcript.lol/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://transcript.lol/link/oauth2/n8n',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://transcript.lol/api/oauth2/n8n',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'hidden',
			default: 'tlol_n8n_client',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			default: 'tlol_n8n_secret',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
