import { Request, Response } from "express";
import prisma from "../db/db.config";


export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        student: {
          select: {
            name: true,
            studentId: true,
            profilePic: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

     res.status(200).json(notifications);
  } catch (error) {
    console.error("error in getAllNotifications:", error);
     res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        isRead: true,
      },
    });

     res.json(notification);
  } catch (error) {
    console.error("error in getAllNotifications:", error);
     res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await prisma.notification.delete({
      where: {
        id: id,
      },
    });

     res.json(data);
  } catch (error) {
    console.error("error in getAllNotifications:", error);
     res.status(500).json({ error: "Internal Server Error" });
  }
};
