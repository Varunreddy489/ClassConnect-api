import prisma from "../db/db.config";
import { Server } from "socket.io";

enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export const sendMessage = async (
  clubId: string,
  userId: number,
  role: Role,
  content: string,
  io: Server
) => {
  try {
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

    io.to(clubId).emit("newMessage", message);

    return message;
  } catch (error) {
    throw new Error("Error sending message");
  }
};
