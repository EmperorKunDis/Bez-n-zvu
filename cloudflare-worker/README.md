# PJ Admin GitHub Proxy Worker

Secure Cloudflare Worker that proxies GitHub API requests. The GitHub token is stored as a Cloudflare secret, never exposed to clients.

## Setup

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Install dependencies
```bash
cd cloudflare-worker
npm install
```

### 4. Create GitHub Personal Access Token
1. Go to https://github.com/settings/tokens/new
2. Select scopes: `repo` (full control of private repositories)
3. Generate and copy the token

### 5. Add secrets to Cloudflare
```bash
# Required: GitHub token
wrangler secret put GITHUB_TOKEN
# Paste your token when prompted

# Optional: Password protection for admin
wrangler secret put ADMIN_PASSWORD
# Enter a password when prompted
```

### 6. Update allowed origins (optional)
Edit `wrangler.toml` and update `ALLOWED_ORIGINS` with your actual domain URLs.

### 7. Deploy
```bash
wrangler deploy
```

After deployment, you'll get a URL like: `https://pj-admin-github-proxy.YOUR_SUBDOMAIN.workers.dev`

## Usage

### Get translations
```
GET /api/translations?site=pavel_jaros_reality&locale=cs
```

### Update translations
```
PUT /api/translations
Content-Type: application/json
X-Admin-Password: your-password (if configured)

{
  "site": "pavel_jaros_reality",
  "locale": "cs",
  "translations": { ... }
}
```

### Health check
```
GET /health
```

## Security

- GitHub token stored as Cloudflare secret (encrypted, never exposed)
- Optional password protection via `X-Admin-Password` header
- CORS restricted to allowed origins
- No token ever sent to the browser

## Update Admin Panels

After deploying, update the `WORKER_URL` in each admin panel to point to your worker URL.
