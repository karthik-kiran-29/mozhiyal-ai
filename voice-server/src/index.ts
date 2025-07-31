import http from 'http';
import { createApp } from './app.js';
import { setupWebSocket } from './websocket/websocketServer';
import { authenticateWebSocket } from './middleware/auth';
import { configDotenv } from "dotenv";

configDotenv();

// Create Express app
const app = createApp();

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket
const wss = setupWebSocket(server);

// Handle WebSocket upgrades with authentication
server.on('upgrade', (request, socket, head) => {
  authenticateWebSocket(request, socket, head, wss);
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});