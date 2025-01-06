import prisma from "../db/db.config";
import { Request, Response } from "express";
import { NotificationType } from "../types/enums";
export const getSuggestedConnections = async (req: Request, res: Response) => {
  try {
    const currentStudentId = req.user.id;

    const notConnectedStudents = await prisma.student.findMany({
      where: {
        id: {
          not: currentStudentId,
        },
        AND: [
          {
            NOT: {
              id: {
                in: (
                  await prisma.connections.findMany({
                    where: {
                      OR: [
                        { senderId: currentStudentId },
                        { receiverId: currentStudentId },
                      ],
                      status: "ACCEPTED",
                    },
                    select: {
                      senderId: true,
                      receiverId: true,
                    },
                  })
                ).flatMap((connection: any) =>
                  connection.senderId === currentStudentId
                    ? connection.receiverId
                    : connection.senderId
                ),
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        studentId: true,
      },
      take: 4,
    });

    res.status(200).json(notConnectedStudents);
  } catch (error) {
    console.error("Error in getSuggestedConnections:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Email and name are required" });
      return;
    }

    const users = await prisma.student.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        studentId: true,
      },
    });

    if (users.length === 0) {
      res.status(404).json({ error: "No users found." });
      return;
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("error in searchUser:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const sendConnectionRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const senderId = req.user.id;

    if (!userId) {
      res.status(400).json({ error: "Receiver ID is required" });
      return;
    }

    const userIdInt = parseInt(userId);

    const sender = await prisma.student.findUnique({
      where: {
        id: senderId,
      },
    });

    const connection = await prisma.connections.create({
      data: {
        senderId,
        receiverId: userIdInt,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: userIdInt,
        content: `${sender?.name} requested to connect with you.`,
        senderId: senderId,
        connectionId: connection.id,
        type: NotificationType.FRIEND_REQUEST,
      },
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error("error in sendConnectionRequest:", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;

    const connection = await prisma.connections.update({
      where: {
        id: Number(connectionId),
      },
      data: {
        status: "ACCEPTED",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: connection.senderId,
        content: `Your friend request has been accepted by ${connection.receiver?.name}.`,
        senderId: connection.receiverId,
        connectionId: connection.id,
        type: "FRIEND_REQUEST_ACCEPTED",
      },
    });

    res.status(200).json({
      message: "Friend request accepted successfully",
      connection,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;

    // Update connection status to REJECTED
    const connection = await prisma.connections.update({
      where: {
        id: Number(connectionId),
      },
      data: {
        status: "REJECTED",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: connection.senderId,
        content: `Your friend request has been rejected by ${connection.receiver?.name}.`,
        senderId: connection.receiverId,
        connectionId: connection.id,
        type: "FRIEND_REQUEST_REJECTED",
      },
    });

    res
      .status(200)
      .json({ message: "Friend request rejected successfully", connection });
  } catch (error) {
    console.error("Error in rejectFriendRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
