// Vercel serverless function for live viewer count
let viewerCount = 0;
let clients = [];

export default function handler(req, res) {
  if (req.method === 'GET' && req.url === '/api/viewers') {
    // SSE (Server-Sent Events) for live updates
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    viewerCount++;
    sendCount();
    clients.push(res);
    req.on('close', () => {
      viewerCount--;
      clients = clients.filter(c => c !== res);
      sendCount();
    });
  } else {
    res.status(404).end();
  }
}

function sendCount() {
  for (const client of clients) {
    client.write(`data: {"count":${viewerCount}}\n\n`);
  }
}
