import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import express, { Request, Response } from "express";

import {
  authRouter,
  clubRouter,
  statsRouter,
  eventsRouter,
  studentRouter,
  teacherRouter,
  messageRouter,
  connectionRouter,
  notificationRouter,
} from "./routes";
import { initializeSocket } from "./socket/webSocket";
import { errorHandler } from "./middleware/ErrorHandler";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

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
app.use("/api/events/", eventsRouter);
app.use("/api/student/", studentRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notifications", notificationRouter);

app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "health Ok!" });
});

httpServer.listen(PORT, () => {
  console.log(`Server-${PORT}`);
});
