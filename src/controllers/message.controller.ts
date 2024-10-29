import { Request, Response } from "express";
import prisma from "../db/db.config";
import { sendMessage } from "../services";
import { getClubSocketId, io } from "../connection/socket";

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
    const role = req.user.role as Role;

    const message = await sendMessage(clubId, userId, role, content, io);

    const club = getClubSocketId(clubId);

    console.log("club:", club);

    if (club) {
      io.to(club).emit("newMessage", {
        content: message,
        senderId: userId,
        timestamp: new Date(),
      });
    }

    res.status(201).json({
      message: "Message sent successfully",
      messageData: message,
    });
  } catch (error) {
    console.error("Error in sendMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return res.status(404).json({ error: "Club not found" });
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

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
