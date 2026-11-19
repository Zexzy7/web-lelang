/**
 * ============================================================================
 * LELANG GP 5K — LIGHTWEIGHT HTTP SERVER
 * Powered by Node.js built-in modules (http, fs, path, url)
 * Run with: agy-node server.js
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Health Check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', app: 'Lelang GP 5K', timestamp: new Date().toISOString() }));
    return;
  }

  // API Proxy for Gemini (Optional Server-Side Relay)
  if (pathname === '/api/gemini/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const apiKey = process.env.GEMINI_API_KEY || payload.apiKey;

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }));
          return;
        }

        const model = payload.model || 'gemini-4-hydrogen';
        const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload.requestBody)
        });

        const data = await geminiRes.json();
        res.writeHead(geminiRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <body style="background:#050507;color:#fff;font-family:sans-serif;padding:3rem;text-align:center;">
          <h2>404 Not Found</h2>
          <p style="color:#94a3b8;">Halaman atau file yang dicari tidak ditemukan.</p>
          <a href="/" style="color:#10b981;">Kembali ke Beranda</a>
        </body>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`✨ LELANG GP 5K — TIKTOK LIVE RAFFLE SERVER IS READY!`);
  console.log(`======================================================`);
  console.log(`🚀 URL Lokal:    http://localhost:${PORT}`);
  console.log(`🎯 OBS View:     http://localhost:${PORT}#obs`);
  console.log(`💎 Model Gemini: gemini-4-hydrogen (GA)`);
  console.log(`======================================================\n`);
});
