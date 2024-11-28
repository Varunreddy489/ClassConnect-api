import { UploadedFile } from "express-fileupload";
import { fileValidator, uploadFile } from "../utils/fileHelper";
import { generateRandomNumber } from "../utils/imageHelper";
import prisma from "../db/db.config";

export const fileService = async (
  clubId: any,
  senderId: number,
  file: UploadedFile | UploadedFile[]
) => {
  try {
    const validationMessage = Array.isArray(file)
      ? fileValidator(file[0].size, file[0].mimetype)
      : fileValidator(file?.size, file?.mimetype);

    if (validationMessage) {
      return { error: { file: validationMessage } };
    }

    const fileName = await uploadFile(file);
    if (!fileName) {
      return { error: { file: "File upload failed" } };
    }

    // Ensure the club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });
    if (!club) {
      throw new Error("Club not found");
    }

    // Ensure the user exists
    const user = await prisma.student.findUnique({
      where: { id: senderId },
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
          senderId: senderId,
          content: "File shared",
          senderType: "STUDENT",
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: senderId,
        body: "", 
        fileUrl: fileName,
        fileType: Array.isArray(file) ? file[0].mimetype : file?.mimetype,
      },
    });

    return { data: newMessage };
  } catch (error) {
    console.error("Error in fileService:", error);
    throw new Error("Internal server error");
  }
};
