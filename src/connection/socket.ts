import http from "http";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";
import { sendMessage } from "../services";

const app = express();

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

export const getClubSocketId = (clubId: string) => {
  return userSocketMap[clubId];
};

const userSocketMap: { [key: string]: string } = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId as string;
  const clubId = socket.handshake.query.clubId as string;

  if (userId) {
    userSocketMap[userId] = socket.id;
    if (clubId) {
      socket.join(clubId);
      console.log(`${userId} joined room ${clubId}`);
    }
  }

  socket.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("sendMessage", async (messageData) => {
    try {
      const { clubId, userId, content, role } = messageData;

      const newMessage = await sendMessage(clubId, userId, role, content, io);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
