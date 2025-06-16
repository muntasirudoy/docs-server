import { Server } from "socket.io";

export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("join-document", ({ docId, user }) => {
      socket.join(docId);
      socket.to(docId).emit("user-joined", user);

      socket.on("send-changes", (delta) => {
        socket.to(docId).emit("receive-changes", delta);
      });

      socket.on("disconnect", () => {
        socket.to(docId).emit("user-left", user);
      });
    });
  });
};
