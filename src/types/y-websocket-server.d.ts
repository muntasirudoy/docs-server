declare module "y-websocket/dist/server.js" {
  import type { IncomingMessage } from "http";
  import type WebSocket from "ws";

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    opts?: { docName?: string }
  ): void;
}
