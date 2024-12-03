import bcrypt from "bcryptjs";

import prisma from "../db/db.config";
import { genTokenAndCookie } from "../utils/genToken";
import { Request, Response } from "express";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, collegeName } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const findCollege = await prisma.college.findUnique({
      where: { name: collegeName },
    });

    if (!findCollege) {
      await prisma.college.create({
        data: { name: collegeName },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        collegeName,
      },
    });

    res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      phoneNumber: newAdmin.phoneNumber,
      collegeName: newAdmin.collegeName,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    });
  } catch (error) {
    console.log("error in createAdmin:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, department, studentId } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !department ||
      !studentId
    ) {
      res.status(404).json({ error: "All fields are required" });
    }

    const findEmail = await prisma.student.findUnique({ where: { email } });
    const findStudent = await prisma.student.findUnique({ where: { email } });

    if (findEmail) res.status(404).json({ error: "Email already exists" });

    if (findStudent)
      res.status(404).json({ error: "Student with this Id Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        studentId,
        year: "1",
        collegeId: 1,
        department,
        role: "STUDENT",
      },
    });

    const { id, role } = newStudent;

    // Generate token and set it in the cookie
    genTokenAndCookie(id, role, res);

    res.status(200).json(newStudent);
  } catch (error) {
    console.log("error in createStudent:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const studentLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const checkEmail = await prisma.student.findUnique({ where: { email } });
    if (!checkEmail) {
      res.status(404).json({ error: "Invalid email or password" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    
    if (!checkPassword) {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const { id, role } = checkEmail;

    genTokenAndCookie(id, role, res);

    res.status(200).json({
      checkEmail: {
        name: checkEmail.name,
        email: checkEmail.email,
        profilePic: checkEmail.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in studentLogin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const studentLogout = async (req: Request, res: Response) => {
  try {
    res.cookie("auth", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("error in logout:", error.message);
    res.status(404).json({ error: "internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const studentId = req.user.id;

    const isStudent = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        year: true,
        name: true,
        email: true,
        course: true,
        semester: true,
        studentId: true,
        department: true,
        profilePic: true,
        phoneNumber: true,
      },
    });

    if (!isStudent) {
      res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ isStudent });
  } catch (error) {
    console.log("error in getAllStudents:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      facultyId,
      phoneNumber,
      designation,
      qualification,
      specialization,
      department,
    } = req.body;

    const findEmail = await prisma.teacher.findUnique({ where: { email } });

    if (findEmail) res.status(404).json({ error: "Email already exists" });

    const facultyIdExists = await prisma.teacher.findUnique({
      where: { facultyId },
    });

    if (facultyIdExists)
      res.status(404).json({ error: "Faculty Id already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await prisma.teacher.create({
      data: {
        name,
        email,
        password: hashedPassword,
        facultyId,
        collegeId: 1,
        phoneNumber,
        designation,
        qualification,
        specialization,
        department,
        role: "TEACHER",
      },
    });

    const { id, role } = newTeacher;

    genTokenAndCookie(id, role, res);

    res.status(201).json(newTeacher);
  } catch (error) {
    console.log("error in createTeacher:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const teacherLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const checkEmail = await prisma.teacher.findUnique({ where: { email } });

    if (!checkEmail) {
      res.status(404).json({ error: "invalid email or password" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      res.status(400).json({ error: "invalid email or password" });
    }

    const { id, role } = checkEmail;

    genTokenAndCookie(id, role, res);

    res.status(200).json({ checkEmail });
  } catch (error) {
    console.log("error in createAdmin:", error);
    res.status(404).json({ error: "internal server error" });
  }
};

export const teacherLogout = async (req: Request, res: Response) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.log("error in logout:", error.message);
    res.status(404).json({ error: "internal server error" });
  }
};
