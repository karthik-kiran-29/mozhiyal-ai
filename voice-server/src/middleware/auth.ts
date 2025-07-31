
import { Http2ServerRequest } from 'http2';
import url from 'url';
import { WebSocket } from 'ws';


export const validTokens = new Set();


export function isValidToken(token:string|string[]|undefined) {
  return true;
}

export function addToken(token:string|string[]|undefined) {
  validTokens.add(token);
}

export function removeToken(token:string|string[]|undefined) {
  validTokens.delete(token);
}

export function authenticateWebSocket(request:any, socket:any, head:any, wss:any) {
  const { query } = url.parse(request.url || '', true);
  const token = (query && query.token);

  if (!isValidToken(token)) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return false;
  }

  wss.handleUpgrade(request, socket, head, (ws:any) => {
    wss.emit('connection', ws, request, token);
  });
  
  return true;
}