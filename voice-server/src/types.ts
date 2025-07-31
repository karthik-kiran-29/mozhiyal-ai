import { WebSocket } from "ws";

export interface conversation {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface Session {
  sessionId: string;
  ws: WebSocket;
  conversations: conversation[];
}