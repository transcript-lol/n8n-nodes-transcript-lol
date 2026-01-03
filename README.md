# n8n-nodes-transcript-lol

This is an n8n community node for [Transcript.lol](https://transcript.lol) - an AI-powered audio and video transcription service.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Transcript.lol Node

#### Recording Resource
- **Create** - Create a new recording for transcription
- **Get** - Get a recording by ID
- **Get Many** - Get many recordings from a workspace

#### Transcript Resource
- **Get** - Get transcript for a recording in various formats (JSON, Plain Text, CSV, Word, SRT, VTT)

#### Workspace Resource
- **Get Many** - Get all workspaces accessible to your account

### Transcript.lol Trigger Node

Listen for events from Transcript.lol:

- **New Transcript** - Triggers when a transcript is completed for a recording
- **Transcript Failed** - Triggers when a transcript fails to be created
- **New Insights** - Triggers when new AI insights are generated for a recording
- **Translation Created** - Triggers when a translation is completed for a recording

## Credentials

This node uses OAuth2 authentication:

1. In n8n, create new credentials for "Transcript.lol OAuth2 API"
2. Click "Connect my account" to authorize with your Transcript.lol account
3. Sign in to your [Transcript.lol account](https://transcript.lol) and authorize the connection
4. Once authorized, you can use the node in your workflows

The OAuth2 flow will obtain an access token that is automatically used as a Bearer token for all API requests.

**Note:** You need to be on the Unlimited Plan to use the n8n integration.

## Compatibility

- Tested with n8n version 1.0.0 and above
- Requires Node.js v22 or higher

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Transcript.lol Documentation](https://transcript.lol/docs)
- [Transcript.lol API Reference](https://transcript.lol/docs/api)

## License

[MIT](LICENSE)
