import { randomBytes } from "crypto";
import { WebSocket } from "ws";
import { Session } from "../types";


const Sessions:Session[] = [];

export function createSession(ws:WebSocket) {
  const sessionId = randomBytes(16).toString("hex");
  console.log(`Session ID: ${sessionId}`);

  const session:Session = {
    sessionId,
    ws,
    conversations: [
      {
        role: 'system',
        content: `You are Madhan, a friendly and knowledgeable virtual assistant `,
      },
    ],
  };

  Sessions.push(session);
  console.log(`Current sessions: ${Sessions.map(s => s.sessionId).join(", ")}`);
  
  return session;
}

export function removeSession(sessionId:string) {
  const index = Sessions.findIndex(s => s.sessionId === sessionId);
  if (index !== -1) {
    Sessions.splice(index, 1);
    console.log(`Session ${sessionId} closed`);
  }
}

export function getSessions() {
  return Sessions;
}