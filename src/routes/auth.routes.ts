import {
  createAdmin,
  createStudent,
  createTeacher,
  forgotPasswordStudent,
  forgotPasswordTeacher,
  getMe,
  passwordChangeStudent,
  passwordChangeTeacher,
  studentLogin,
  studentLogout,
  teacherLogin,
  teacherLogout,
} from "../controllers";
import express from "express";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.post("/student/login", studentLogin);
router.get("/student/me", checkIsAuth, getMe);
router.post("/student/logout", studentLogout);
router.post("/admin/createAdmin", createAdmin);
router.post("/student/register", createStudent);
router.post("/student/changePassword/:token", passwordChangeStudent);

router.post("/teacher/login", teacherLogin);
router.post("/teacher/logout", teacherLogout);
router.post("/teacher/register", createTeacher);
router.post("/teacher/changePassword/:token", passwordChangeTeacher);

// ^  Email Routes

router.post("/student/forgotPassword", forgotPasswordStudent);
router.post("/teacher/forgotPassword", forgotPasswordTeacher);

export { router as authRouter };
