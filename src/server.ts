// import path from "path";
// import fs from 'node:fs';
import cors from "cors";
import dotenv from "dotenv";
// import cron from "node-cron";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import express, { Request, Response } from "express";

// import { limiter } from "./config/rateLimiter";
import { authRouter } from "./routes/auth.routes";
import { clubRouter } from "./routes/club.routes";
import { initializeSocket } from "./socket/webSocket";
import { messageRouter } from "./routes/message.routes";
import { teacherRouter } from "./routes/teacher.routes";
import { studentRouter } from "./routes/student.routes";
import { errorHandler } from "./middleware/ErrorHandler";
import { connectionRouter } from "./routes/connection.routes";
import { notificationRouter } from "./routes/notification.routes";
import { statsRouter } from "./routes/stats.routes";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// app.use(limiter);
app.use(errorHandler);
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use("/api", clubRouter);
app.use("/api", messageRouter);
app.use("/api/auth", authRouter);
app.use("/api/stats/", statsRouter);
app.use("/api/auth/", teacherRouter);
app.use("/api/student/", studentRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notifications", notificationRouter);

// const directories = ["public/images", "public/files"];

// directories.forEach((dir) => {
//   const tempDir = path.join(process.cwd(), dir);
//   cron.schedule("0 * * * *", () => {
//     if (fs.existsSync(tempDir)) {
//       fs.readdir(tempDir, (err, files) => {
//         if (err) {
//           console.error(`Error reading directory ${tempDir}:`, err);
//           return;
//         }

//         files.forEach((file) => {
//           const filePath = path.join(tempDir, file);
//           fs.unlink(filePath, (err) => {
//             if (err) {
//               console.error(`Error deleting file ${filePath}:`, err);
//             } else {
//               console.log(`Deleted file: ${filePath}`);
//             }
//           });
//         });
//       });
//     } else {
//       console.log(`Directory ${tempDir} does not exist.`);
//     }
//   });
// });

app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "health Ok!" });
});

httpServer.listen(PORT, () => {
  console.log(`Server-${PORT}`);
});
