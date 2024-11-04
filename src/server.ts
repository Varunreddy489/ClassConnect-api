import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import express, { Request, Response } from "express";

import { apiRoutes } from "./routes/api.routes";
import { app, server } from "./connection/socket";
import { errorHandler } from "./middleware/ErrorHandler";

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

app.use("/api", apiRoutes);

app.get("/", async (req: Request, res: Response) => {
  res.send({ message: "health Ok!" });
});
  
server.listen(PORT, () => {
  console.log(`Server-${PORT}`);
});
