// Simple reverse proxy server for all 4 websites

const PORT = 8000;

const routes = {
  '/design': 'http://localhost:3001',
  '/rekonstrukce': 'http://localhost:3002',
  '/reality': 'http://localhost:3003',
  '/sprava': 'http://localhost:3004',
};

const indexHTML = `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pavel Jaroš - Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            width: 100%;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-top: 40px;
        }
        .card {
            background: white;
            border-radius: 16px;
            padding: 32px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .card h2 {
            font-size: 1.8rem;
            margin-bottom: 12px;
            color: #667eea;
        }
        .card p {
            color: #666;
            line-height: 1.6;
        }
        .emoji {
            font-size: 3rem;
            margin-bottom: 16px;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pavel Jaroš</h1>
            <p class="subtitle">Vyberte si sekci</p>
        </div>
        <div class="grid">
            <a href="/design" class="card">
                <span class="emoji">🎨</span>
                <h2>Design</h2>
                <p>Designové služby a portfolia</p>
            </a>
            <a href="/rekonstrukce" class="card">
                <span class="emoji">🔨</span>
                <h2>Rekonstrukce</h2>
                <p>Kompletní rekonstrukce bytů a domů</p>
            </a>
            <a href="/reality" class="card">
                <span class="emoji">🏠</span>
                <h2>Reality</h2>
                <p>Prodej a pronájem nemovitostí</p>
            </a>
            <a href="/sprava" class="card">
                <span class="emoji">📋</span>
                <h2>Správa</h2>
                <p>Správa nemovitostí</p>
            </a>
        </div>
    </div>
</body>
</html>
`;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve index page
    if (url.pathname === '/' || url.pathname === '') {
      return new Response(indexHTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Find matching route
    for (const [path, target] of Object.entries(routes)) {
      if (url.pathname.startsWith(path)) {
        const targetURL = target + url.pathname.slice(path.length) + url.search;

        try {
          const response = await fetch(targetURL, {
            method: req.method,
            headers: req.headers,
            body: req.body,
          });

          return response;
        } catch (error) {
          return new Response(`Error proxying to ${target}: ${error}`, {
            status: 502,
            headers: { 'Content-Type': 'text/plain' },
          });
        }
      }
    }

    return new Response('Not Found', { status: 404 });
  },
});

console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
console.log(`\nAvailable routes:`);
console.log(`  - http://localhost:${PORT}/         (Index page)`);
console.log(`  - http://localhost:${PORT}/design`);
console.log(`  - http://localhost:${PORT}/rekonstrukce`);
console.log(`  - http://localhost:${PORT}/reality`);
console.log(`  - http://localhost:${PORT}/sprava`);
