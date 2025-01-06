import { Request, Response } from "express";

import {
  imageService,
  changePassword,
  profileService,
  handleForgotPassword,
} from "../services";
import prisma from "../db/db.config";



export const updateProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    console.log(req.files);

    if (!req.files || !req.files.profile) {
      res.status(400).json({ error: "No profile picture uploaded." });
      return;
    }

    const profile = req.files.profile;

    const result = await imageService(userId, prisma.student, profile);

    if (result.error) {
      res.status(400).json({ errors: result.error });
    }

    res.status(201).json({
      message: "Profile picture updated successfully",
      data: result.data,
    });
  } catch (error) {
    console.log("error in updateProfilePic:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const body = req.body;

    const result = await profileService(userId, prisma.student, body);

    res.status(201).json({
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error) {
    console.log("error in updateProfile:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        studentId: true,
      },
    });

    res.status(200).json({ students });
  } catch (error) {
    console.log("error in getAllStudents:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId) {
      res.status(400).json({ error: "studentId is required" });
      return;
    }

    const student = await prisma.student.findUnique({
      where: {
        studentId: studentId,
      },
      include:{
        clubs: true,
        connections:true,
      }
    });

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    console.log("error in getStudentById:", error);
    res.status(404).json({ error: "Internal server error" });
  }
};
