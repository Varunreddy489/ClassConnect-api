import express from "express";
import { checkIsAuth } from "../middleware/CheckAuth";
import {
  getAllStudents,
  getStudentById,
  updateProfile,
  updateProfilePic,
} from "../controllers";

const router = express.Router();

router.get("/all", checkIsAuth, getAllStudents);
router.put("/pic", checkIsAuth, updateProfilePic);
router.put("/profile", checkIsAuth, updateProfile);
router.get("/profile/:studentId", checkIsAuth, getStudentById);

export { router as studentRouter };
