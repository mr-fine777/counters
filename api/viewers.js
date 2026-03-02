// Vercel serverless function for live viewer count

// Vercel serverless functions are stateless, so we can't keep a global viewer count or client list.
// Instead, we treat each connection as a single viewer and send count = 1 (the current client).
// For a true global live count, you'd need a persistent store (like Redis or Upstash) or a hosted WebSocket service.

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    // Just send 1 for this demo (since Vercel serverless can't track global state)
    res.write(`data: {"count":1}\n\n`);
    // Keep the connection open
    // Optionally, you could send periodic pings here
    // End after a timeout to avoid hanging connections
    setTimeout(() => res.end(), 30000);
  } else {
    res.status(404).end();
  }
}
