import { WebSocketServer, WebSocket } from "ws";
import { createSession, removeSession } from '../services/sessionService';
import { handleMessage } from '../handlers/messageHandlers';
import { Http2Server, Http2ServerRequest } from "http2";
import { Server } from "http";

export function setupWebSocket(server:Server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws:WebSocket, request:Http2ServerRequest, token:String) => {
    console.log("New client connected");

    const session = createSession(ws);

    ws.on("message", async (message:Buffer) => {
      await handleMessage(message, session);
    });

    ws.on("close", () => {
      removeSession(session.sessionId);
      console.log("Client disconnected");
    });
  });

  return wss;
}