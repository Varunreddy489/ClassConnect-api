// import { Server } from "socket.io";
// import { Server as HttpServer } from "http";


// export const initializeSocket = (server: HttpServer) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       credentials: true,
//     },
//   });

//   const userSockets = new Map();
//   const userActivities = new Map();

//   io.on("connection", (socket) => {
//     socket.on("user_connected", (userId: string) => {
//       userSockets.set(userId, socket.id);
//       userActivities.set(userId, socket.id);

//       io.emit("user_connected", userId);
//       socket.emit("users_online", Array.from(userSockets.keys()));

//       io.emit("activities", Array.from(userActivities.entries()));
//     });

//     socket.on("disconnect", () => {
//       let disconnectedUserId;
//       for (const [userId, socketId] of userSockets.entries()) {
//         // find disconnected user
//         if (socketId === socket.id) {
//           disconnectedUserId = userId;
//           userSockets.delete(userId);
//           userActivities.delete(userId);
//           break;
//         }
//       }
//       if (disconnectedUserId) {
//         io.emit("user_disconnected", disconnectedUserId);
//       }
//     });
//   });
// };
