import { Request, Response } from "express";
import prisma from "../db/db.config";

export const fetchStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const createdClubsCount = await prisma.club.count({
      where: {
        creatorId: userId,
      },
    });

    const joinedClubsCount = await prisma.club.count({
      where: { members: { some: { id: userId } } },
    });

    const connectionsCount = await prisma.student.count({
      where: {
        OR: [
          { connections: { some: { id: userId } } },
          { connectedBy: { some: { id: userId } } },
        ],
      },
    });

    const pendingConnectionsCount = await prisma.connections.count({
      where: {
        OR: [
          { senderId: userId, status: "PENDING" },
          { receiverId: userId, status: "PENDING" },
        ],
      },
    });

    const unreadNotificationsCount = await prisma.notification.count({
      where: { recipientId: userId, isRead: false },
    });

    res.status(200).json({
      createdClubsCount,
      joinedClubsCount,
      connectionsCount,
      pendingConnectionsCount,
      unreadNotificationsCount,
    });
  } catch (error: any) {
    console.error("error in fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
};
