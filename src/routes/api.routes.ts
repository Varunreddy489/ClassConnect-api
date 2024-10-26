import { Router } from "express";

import {
  getMe,
  exitClub,
  addToClub,
  deleteClub,
  createClub,
  updateClub,
  getClubById,
  getAllClubs,
  createAdmin,
  studentLogin,
  sendMessages,
  teacherLogin,
  createStudent,
  teacherLogout,
  updateProfile,
  createTeacher,
  studentLogout,
  createCollege,
  getAllMessages,
  getAllStudents,
  joinClubRequest,
  getClubsByMember,
  updateProfilePic,
  rejectJoinRequest,
  checkRequestStatus,
  acceptJoinRequest,
  getAllJoinRequests,
  passwordChangeTeacher,
  forgotPasswordStudent,
  passwordChangeStudent,
  forgotPasswordTeacher,
  removeMember,
} from "../controllers";

import { checkIsAuth } from "../middleware/CheckAuth";
import { verifyRole } from "../middleware/verifyRole";

const router = Router();

// ! Auth Routes

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

// ! Email Routes

router.post("/teacher/forgotPassword", forgotPasswordTeacher);
router.post("/student/forgotPassword", forgotPasswordStudent);

// ! Student Routes

router.get("/student/all", checkIsAuth, getAllStudents);
router.put("/student/profile", checkIsAuth, updateProfile);
router.put("/student/pic", checkIsAuth, updateProfilePic);

// ! Teacher Routes

router.post("/teacher/updateProfile");

// ! College Routes

router.post("/admin/createCollege", createCollege);

// ! Club Routes

// * 1. Club Creation

router.get("/club", checkIsAuth, getAllClubs);
router.post("/club/create", checkIsAuth, createClub);
router.get("/user/club", checkIsAuth, getClubsByMember);
router.delete("/club/:clubId", checkIsAuth, deleteClub);
router.put("/club/update/:clubId", checkIsAuth, updateClub);
router.get("/club/details/:clubId", checkIsAuth, getClubById);

// * 2.Club Ops

router.put("/club/add/:clubId", checkIsAuth, addToClub);
router.post("/club/join/:clubId", checkIsAuth, joinClubRequest);
router.get("/club/join/:clubId", checkIsAuth, getAllJoinRequests);
router.post("/club/accept/:clubId", checkIsAuth, acceptJoinRequest);

//  Todo

router.post("/club/check/:clubId", checkIsAuth, exitClub);
router.put("/club/add/:clubId", checkIsAuth, removeMember);
router.post("/club/reject/:clubId", checkIsAuth, rejectJoinRequest);
router.post("/club/check/:clubId", checkIsAuth, checkRequestStatus);

// * Club Messages

router.post("/club/message/:clubId", checkIsAuth, sendMessages);
router.get("/club/message/:clubId", checkIsAuth, getAllMessages);

export { router as apiRoutes };

// verifyRole(["STUDENT", "ADMIN"]),
