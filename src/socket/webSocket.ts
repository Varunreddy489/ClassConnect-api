import { Server, Socket } from "socket.io";

let io: Server;
const connectedUsers = new Map<string, string>();
const userActivities = new Map<string, string>();

export const initializeSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.warn("Current rooms:", Array.from(io.sockets.adapter.rooms.keys()));

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("user_connected", (data: { userId: string;  }) => {
      const { userId } = data;
      if (!userId) {
        return socket.disconnect(true).emit("error", "User ID is required");
      }

      connectedUsers.set(userId, socket.id);
      userActivities.set(userId, "online");
      io.emit("user_connected", userId);
      socket.emit("users_online", Array.from(connectedUsers.keys()));
      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("join_club", (clubId: string) => {
      if (!clubId) {
        return socket.emit("error", "Club ID is required to join a room.");
      }
      socket.join(clubId);
      console.log(`User ${socket.id} joined room ${clubId}`);
      io.to(clubId).emit("user_joined", { userId: socket.id, clubId });
    });

    socket.on("disconnect", () => {
      const disconnectedUser = Array.from(connectedUsers.entries()).find(
        ([_, socketId]) => socketId === socket.id
      );

      if (disconnectedUser) {
        const [userId] = disconnectedUser;
        connectedUsers.delete(userId);
        userActivities.set(userId, "offline");

        io.emit("user_disconnected", userId);
        io.emit("activities", Array.from(userActivities.entries()));
      }

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const getConnectedUsers = () => connectedUsers;
