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

This node uses OAuth2 with PKCE (Proof Key for Code Exchange) for secure authentication. No client secret is required — the integration uses a public client ID (`tlol_n8n_client`) and relies on PKCE's cryptographic code challenge/verifier exchange to secure the authorization flow.

### Setup

1. In n8n, create new credentials for "Transcript.lol OAuth2 API"
2. Click "Connect my account" — n8n will automatically handle the PKCE flow
3. Sign in to your [Transcript.lol account](https://transcript.lol) and authorize the connection
4. Once authorized, you can use the node in your workflows

### How It Works

1. n8n generates a random `code_verifier` and derives a `code_challenge` (SHA-256 hash)
2. The `code_challenge` is sent with the authorization request to Transcript.lol
3. After you authorize, n8n sends the original `code_verifier` to the token endpoint
4. Transcript.lol verifies that `SHA256(code_verifier)` matches the stored `code_challenge`
5. On success, an access token (Bearer token) is issued and used for all API requests

This approach eliminates the need for a shared client secret, making it safe for the credential configuration to be distributed as part of a community node.

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
