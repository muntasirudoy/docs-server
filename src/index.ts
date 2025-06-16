import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
// import { Server as SocketIOServer } from "socket.io";
// import WebSocket from "ws";
// import { setupWSConnection } from "y-websocket/dist/server.js";

import authRoutes from "./routes/auth.routes";
import docRoutes from "./routes/document.routes";

dotenv.config();

const app = express();
const server = http.createServer(app);

// const io = new SocketIOServer(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   },
// });

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/documents", docRoutes);

// const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const { url } = request;

  // if (url && url.startsWith("/yjs")) {
  //   wss.handleUpgrade(request, socket, head, (ws) => {
  //     const docName = url.slice(5);
  //     setupWSConnection(ws, request, { docName });
  //   });
  // } else {
  //   socket.destroy();
  // }
});

const MONGO_URI = "mongodb://localhost:27017/collab-docs";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Yjs WebSocket running at ws://localhost:${PORT}/yjs`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
