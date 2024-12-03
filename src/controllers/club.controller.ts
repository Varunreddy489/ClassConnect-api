import { Request, Response } from "express";

import prisma from "../db/db.config";
import { imageService } from "../services";
import { NotificationType } from "../types/enums";

export const createClub = async (req: Request, res: Response) => {
  try {
    const { membersData } = req.body;
    const { name, description, members } = membersData;
    const studentId = req.user.id;

    if (!name) {
      res.status(400).json({
        error: "Club name and members are required.",
      });
      return;
    }

    if (members.length === 0) {
      res.status(400).json({ error: "Size is zero" });
    }

    const checkStudent = await prisma.student.findUnique({
      where: { id: Number(studentId) },
    });

    if (!checkStudent) {
      res.status(404).json({ error: "Unauthorized Access" });
      return;
    }

    const isClub = await prisma.club.findUnique({
      where: { name },
    });

    console.log(isClub);

    if (isClub) {
      res.status(409).json({
        message: "Club name already exists. Try a different one.",
      });
    }

    const memberIds = await Promise.all(
      members.map(async (memberId: string) => {
        const member = await prisma.student.findUnique({
          where: { id: Number(memberId) },
        });
        if (member) {
          return { id: member.id };
        } else {
          throw new Error(`Member with ID ${memberId} not found`);
        }
      })
    );

    memberIds.push({ id: Number(studentId) });

    const newClub = await prisma.club.create({
      data: {
        name,
        description,
        creatorId: Number(studentId),
        members: {
          connect: memberIds,
        },
        collegeId: 1,
      },
    });

    const notifications = await Promise.all(
      memberIds.map(async (member) => {
        await prisma.notification.create({
          data: {
            type: "CLUB_CREATED",
            content: `You have been added to the club: ${name}.`,
            recipientId: member.id,
            senderId: studentId,
          },
        });
      })
    );

    res.status(201).json({
      message: "Club created successfully",
      club: newClub,
      notication: notifications,
    });
  } catch (error) {
    console.error("Error in createClub:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    if (club?.creatorId !== Number(userId)) {
      res.status(403).json({
        error: "Unauthorized: Only the club creator can add members",
      });
      return;
    }

    const profile = req.files?.profile;

    if (!profile) {
      res.status(400).json({ error: "No profile picture uploaded." });
      return;
    }

    const result = await imageService(clubId, prisma.club, profile);

    res.status(200).json({
      message: "Profile picture updated successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in updateClub:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    const { creatorId, members } = req.body;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    if (club?.creatorId !== Number(creatorId)) {
      res.status(403).json({
        error: "Unauthorized: Only the club creator can add members",
      });
      return;
    }

    if (!Array.isArray(members) || members.length === 0) {
      res.status(400).json({ error: "No members provided" });
      return;
    }

    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: {
        members: {
          connect: members.map((id: number) => ({ id })),
        },
      },
      include: {
        members: true,
      },
    });

    res.status(200).json(updatedClub);
  } catch (error) {
    console.error("error in createClub:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        profilePic: true,
        creatorId: true,
        members: {
          select: {
            name: true,
            profilePic: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(clubs);
  } catch (error) {
    console.error("error in getAllClubs:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const getClubById = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    const club = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        name: true,
        profilePic: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        members: {
          select: {
            studentId: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        messages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            Message: {
              select: {
                body: true,
                senderId: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    res.status(200).json(club);
  } catch (error) {
    console.error("Error in getClubById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserClubs = async (req: Request, res: Response) => {
  try {
    const studentId = req.user.id;

    const clubs = await prisma.club.findMany({
      where: {
        members: {
          some: { id: studentId },
        },
      },
      include: {
        members: {
          select: {
            name: true,
            email: true,
            studentId: true,
            profilePic: true,
          },
        },
        creator: {
          select: {
            name: true,
            email: true,
            studentId: true,
            profilePic: true,
          },
        },
      },
    });

    const friends = await prisma.connections.findMany({
      where: {
        OR: [
          { senderId: studentId, status: "ACCEPTED" },
          { receiverId: studentId, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true,
          },
        },
      },
    });

    const uniqueFriends = friends.map((connection:any) =>
      connection.senderId === studentId
        ? connection.receiver
        : connection.sender
    );

    res.status(200).json({ clubs, friends: uniqueFriends });
  } catch (error) {
    console.error("error in getuserCLubs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id;

    const isClub = await prisma.club.findUnique({
      where: {
        id: clubId,
      },
      select: {
        creatorId: true,
      },
    });

    if (isClub?.creatorId !== userId) {
      res.status(400).json({
        error: "Your are Unauthorised to delete the club ",
      });
      return;
    }

    await prisma.joinRequest.deleteMany({
      where: { clubId },
    });

    const conversations = await prisma.conversations.findMany({
      where: { clubId },
      select: { id: true },
    });

    const conversationIds = conversations.map(
      (conversation:any) => conversation.id
    );

    await prisma.message.deleteMany({
      where: { conversationId: { in: conversationIds } },
    });

    await prisma.conversations.deleteMany({
      where: { clubId },
    });

    const deleteClub = await prisma.club.delete({
      where: {
        id: clubId,
      },
    });

    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.error("error in deleteClub:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const joinClubRequest = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const userId = req.user.id;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    const student = await prisma.student.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        profilePic: true,
        studentId: true,
      },
    });

    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        clubId: clubId,
        studentId: userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      res.status(409).json({
        message: "You have already requested to join this club.",
      });
      return;
    }

    const newRequest = await prisma.joinRequest.create({
      data: {
        clubId: clubId,
        studentId: userId,
      },
    });

    const notification = await prisma.notification.create({
      data: {
        clubId: clubId,
        recipientId: club.creatorId,
        type: NotificationType.JOIN_REQUEST,
        content: `${student?.name} (${student?.studentId}) join request has been made for your club, ${club.name}. Request ID: ${newRequest.id}.`,
        senderId: userId,
        joinRequestId: newRequest.id,
      },
    });

    const detailedNotification = await prisma.notification.findUnique({
      where: { id: notification.id },
      include: {
        student: { select: { name: true, email: true, studentId: true } },
        club: { select: { name: true, profilePic: true } },
        joinRequest: { select: { id: true } },
      },
    });

    res.status(201).json({
      message: "Join request sent successfully",
      joinRequest: newRequest,
      request: existingRequest,
      notification: detailedNotification,
    });
  } catch (error) {
    console.error("Error in joinClubRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllJoinRequests = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    // console.log("req.user:", req.user);

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        creatorId: true,
      },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    if (club.creatorId !== req.user.id) {
      res.status(403).json({
        error: "You are not authorized to view join requests for this club.",
      });
      return;
    }

    const joinRequests = await prisma.joinRequest.findMany({
      where: {
        clubId: clubId,
      },
    });

    if (!joinRequests) {
      res.json({ message: "No Joining Requests." });
      return;
    }

    res.json(joinRequests);
  } catch (error) {
    console.error("Error in getAllJoinRequests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const acceptJoinRequest = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { requestId } = req.body;
    const userId = req.user.id;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        creatorId: true,
      },
    });

    if (!club) {
      res.status(404).json({ error: "Club not found" });
      return;
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: Number(requestId) },
      include: {
        club: true,
      },
    });

    if (!joinRequest) {
      res.status(404).json({ error: "Join request not found" });
      return;
    }

    if (joinRequest.club.creatorId !== userId) {
      res.status(403).json({
        error: "You are not authorized to accept this join request.",
      });
      return;
    }

    if (joinRequest.status === "APPROVED") {
      res.status(400).json({
        message: "This join request has already been accepted.",
      });
      return;
    }

    const updatedRequest = await prisma.joinRequest.update({
      where: { id: joinRequest.id },
      data: {
        status: "APPROVED",
      },
    });

    await prisma.club.update({
      where: { id: joinRequest.clubId },
      data: {
        members: {
          connect: { id: joinRequest.studentId },
        },
      },
    });

    const notification = await prisma.notification.create({
      data: {
        recipientId: joinRequest.studentId,
        type: NotificationType.CLUB_REQUEST_ACCEPTED,
        content: `Your request to join the club "${club?.name}" has been accepted.`,
        senderId: userId,
      },
    });

    res.json({
      message: "Join request accepted successfully",
      request: updatedRequest,
      notification: notification,
    });
  } catch (error) {
    console.error("Error in acceptJoinRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userCreatedClubs = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const checkUser = await prisma.student.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userId) {
      res.status(404).json({ error: "User not found" });
      return;
    } 

    const createdClubs = await prisma.club.findMany({
      where: {
        creatorId: userId,
      },
    });

    res.json(createdClubs);
  } catch (error) {
    console.error("Error in userCreatedClubs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectJoinRequest = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("Error in rejectJoinRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("Error in removeMember:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeMessages = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    await prisma.message.deleteMany({
      where: {
        id: clubId,
      },
    });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error("Error in removeMessages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const exitClub = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("Error in rejectJoinRequest:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
