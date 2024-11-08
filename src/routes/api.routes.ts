import express from "express";

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
  removeMember,
  teacherLogin,
  createStudent,
  teacherLogout,
  updateProfile,
  createTeacher,
  studentLogout,
  getAllStudents,
  joinClubRequest,
  getClubsByMember,
  updateProfilePic,
  rejectJoinRequest,
  userCreatedClubs,
  acceptJoinRequest,
  getAllJoinRequests,
  passwordChangeTeacher,
  forgotPasswordStudent,
  passwordChangeStudent,
  forgotPasswordTeacher,
  getAllNotifications,
  sendMessages,
  getAllMessages,
  markNotificationAsRead,
  deleteNotification,
  studentLogin,
  sendFiles,
  removeMessages,
} from "../controllers";

import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

// ^ 1 Auth Routes

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

// ^ 2 Email Routes

router.post("/teacher/forgotPassword", forgotPasswordTeacher);
router.post("/student/forgotPassword", forgotPasswordStudent);

// ^ 3 Student Routes

router.get("/student/all", checkIsAuth, getAllStudents);
router.put("/student/pic", checkIsAuth, updateProfilePic);
router.put("/student/profile", checkIsAuth, updateProfile);

// ^ 4 Teacher Routes

router.post("/teacher/updateProfile");

// ^ 5 Club Routes

// *  Club Creation

router.get("/club", checkIsAuth, getAllClubs);
router.post("/club/create", checkIsAuth, createClub);
router.get("/user/club", checkIsAuth, getClubsByMember);
router.delete("/club/:clubId", checkIsAuth, deleteClub);
router.put("/club/update/:clubId", checkIsAuth, updateClub);
router.get("/club/details/:clubId", checkIsAuth, getClubById);

// * Club Ops

router.put("/club/add/:clubId", checkIsAuth, addToClub);
router.get("/club/user", checkIsAuth, userCreatedClubs);
router.post("/club/join/:clubId", checkIsAuth, joinClubRequest);
router.get("/club/join/:clubId", checkIsAuth, getAllJoinRequests);
router.post("/club/accept/:clubId", checkIsAuth, acceptJoinRequest);
router.post("/club/reject/:clubId", checkIsAuth, rejectJoinRequest);
router.delete("/club/-/:clubId", checkIsAuth, removeMessages);

//  Todo

router.post("/club/check/:clubId", checkIsAuth, exitClub);
router.delete("/club/remove/:clubId", checkIsAuth, removeMember);

// ^ 6 Message Routes

router.post("/club/file/:clubId", checkIsAuth, sendFiles);
router.post("/club/message/:clubId", checkIsAuth, sendMessages);
router.get("/club/message/:clubId", checkIsAuth, getAllMessages);

// ^ 7 Notification Routes

router.get("/notifications", checkIsAuth, getAllNotifications);
router.delete("/notifications/:id", checkIsAuth, deleteNotification);
router.put("/notifications/:id", checkIsAuth, markNotificationAsRead);

export { router as apiRoutes };

// verifyRole(["STUDENT", "ADMIN"]),
