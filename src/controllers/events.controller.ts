import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import prisma from "../db/db.config";
import { imageService } from "../services";
import cloudinary from "../config/cloudinary";
import { NotificationType } from "../types/enums";

const uploadToCloudinary = async (file: UploadedFile) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
};
export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const profile = req.files?.profile;

    if (!profile) {
      res.status(400).json({ error: "No profile uploaded for the event." });
      return;
    }

    const user = await prisma.student.findUnique({
      where: { id: userId },
      select: {
        name: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const newEvent = await prisma.events.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        startDate: req.body.date,
        endDate: req.body.endDate,
        location: req.body.location,
        creatorId: userId,
      },
    });

    const imageUploadResult = await imageService(
      newEvent.id,
      prisma.events,
      profile
    );

    if (imageUploadResult.error) {
      res.status(400).json({ error: imageUploadResult.error });
      return;
    }
    await prisma.notification.create({
      data: {
        type: NotificationType.EVENT_CREATED,
        content: `${newEvent.title} has been created by ${user.name}.`,
        senderId: userId,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("error in createEvent ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.events.findMany({});

    if (!events) {
      res.json({ error: "No events found" });
      return;
    }
    res.status(200).json(events);
  } catch (error) {
    console.error("error in getAllEvents ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("error in getEventById ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.error("error in deleteEvent ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
