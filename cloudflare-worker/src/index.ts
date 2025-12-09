/**
 * PJ Admin GitHub Proxy Worker
 *
 * This Cloudflare Worker securely proxies requests to GitHub API.
 * The GitHub token is stored as a Cloudflare secret, never exposed to clients.
 *
 * Setup:
 * 1. npm install -g wrangler
 * 2. wrangler login
 * 3. wrangler secret put GITHUB_TOKEN (paste your GitHub token)
 * 4. wrangler secret put ADMIN_PASSWORD (optional, for extra security)
 * 5. wrangler deploy
 */

interface Env {
  GITHUB_TOKEN: string;
  ADMIN_PASSWORD?: string;
  GITHUB_REPO: string;
  ALLOWED_ORIGINS: string;
}

const corsHeaders = (origin: string, allowedOrigins: string) => {
  const origins = allowedOrigins.split(',').map(o => o.trim());
  const isAllowed = origins.includes(origin) || origins.includes('*');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : origins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGINS);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Optional password protection
    if (env.ADMIN_PASSWORD) {
      const providedPassword = request.headers.get('X-Admin-Password');
      if (providedPassword !== env.ADMIN_PASSWORD) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }
    }

    try {
      // Route: GET /api/translations?site=pavel_jaros_reality&locale=cs
      if (url.pathname === '/api/translations' && request.method === 'GET') {
        const site = url.searchParams.get('site');
        const locale = url.searchParams.get('locale') || 'cs';

        if (!site) {
          return new Response(JSON.stringify({ error: 'Missing site parameter' }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const filePath = `${site}/messages/${locale}.json`;
        const response = await fetch(
          `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}`,
          {
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'PJ-Admin-Worker',
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          return new Response(JSON.stringify({ error: error.message || 'Failed to fetch' }), {
            status: response.status,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const data = await response.json() as { content: string; sha: string };
        const content = atob(data.content.replace(/\n/g, ''));

        return new Response(JSON.stringify({
          translations: JSON.parse(content),
          sha: data.sha
        }), {
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Route: PUT /api/translations
      if (url.pathname === '/api/translations' && request.method === 'PUT') {
        const body = await request.json() as {
          site: string;
          locale: string;
          translations: Record<string, unknown>;
          sha?: string;
        };

        if (!body.site || !body.locale || !body.translations) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const filePath = `${body.site}/messages/${body.locale}.json`;
        const content = JSON.stringify(body.translations, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(content)));

        // Get current SHA if not provided
        let sha = body.sha;
        if (!sha) {
          const getResponse = await fetch(
            `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}`,
            {
              headers: {
                'Authorization': `token ${env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'PJ-Admin-Worker',
              },
            }
          );
          if (getResponse.ok) {
            const getData = await getResponse.json() as { sha: string };
            sha = getData.sha;
          }
        }

        // Update file
        const updateResponse = await fetch(
          `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${filePath}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
              'User-Agent': 'PJ-Admin-Worker',
            },
            body: JSON.stringify({
              message: `Update ${body.locale}.json via admin panel`,
              content: contentBase64,
              sha: sha,
              branch: 'main',
            }),
          }
        );

        if (!updateResponse.ok) {
          const error = await updateResponse.json();
          return new Response(JSON.stringify({ error: (error as { message?: string }).message || 'Failed to update' }), {
            status: updateResponse.status,
            headers: { ...headers, 'Content-Type': 'application/json' },
          });
        }

        const result = await updateResponse.json();
        return new Response(JSON.stringify({ success: true, commit: result }), {
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Health check
      if (url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', repo: env.GITHUB_REPO }), {
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
