// Simple Node.js WebSocket server for live viewer count
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let viewerCount = 0;

wss.on('connection', (ws) => {
  viewerCount++;
  broadcastViewerCount();

  ws.on('close', () => {
    viewerCount--;
    broadcastViewerCount();
  });
});

function broadcastViewerCount() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ count: viewerCount }));
    }
  });
}

app.use(express.static(__dirname));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
