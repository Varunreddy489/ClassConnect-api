import { Request, Response } from "express";

import prisma from "../db/db.config";
import { getIo } from "../socket/webSocket";
import { UploadedFile } from "express-fileupload";
import { fileService } from "../services/file.service";
import redisCache from "../db/redis.config";

enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export const sendMessages = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { content } = req.body;

    const userId = req.user.id;

    if (!content) {
      throw new Error("Message content is required");
    }

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });
    if (!club) {
      throw new Error("Club not found");
    }

    const user = await prisma.student.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    let conversation = await prisma.conversations.findFirst({
      where: { clubId },
    });

    if (!conversation) {
      conversation = await prisma.conversations.create({
        data: {
          clubId,
          senderId: userId,
          content,
          senderType: "STUDENT",
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        body: content,
      },
    });

    const io = getIo();
    const roomExists = io.sockets.adapter.rooms.get(clubId);

    if (!roomExists) {
      console.warn(`Room ${clubId} does not exist.`);
    }

    console.warn("Emitting message to room:", clubId);

    io.to(clubId).emit("new_message", {
      id: message.id,
      body: message.body,
      senderId: userId,
      createdAt: message.createdAt,
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error("Error in sendMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

  //  redisCache.get(`/api/club/message/${clubId}`, (err: any, entries: any[]) => {
  //     if (err) {
  //       console.error("Redis cache error:", err);
  //       return;
  //     }

  //     // Check if there's cached data
  //     if (entries.length > 0) {
  //       // If cache exists, send it back
  //       res.json(JSON.parse(entries[0].body));
  //       console.warn("Cache hit:", entries[0]);
  //       return;
  //     }
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
    }

    const messages = await prisma.message.findMany({
      where: {
        conversation: { clubId: clubId },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            studentId: true,
          },
        },
      },
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendFiles = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const senderId = req.user.id;
    const file = req.files?.file as UploadedFile;

    if (!clubId) {
      res.status(400).json({ error: "Message clubId is required" });
    }

    if (!file) {
      res.status(400).send({ error: "File is required" });
    }

    const sendFile = await fileService(clubId, senderId, file);

    res.status(200).json({ sendFile, senderId });
  } catch (error) {
    console.error("Error in sendDocs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
