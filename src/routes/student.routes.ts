import express from "express";
import { checkIsAuth } from "../middleware/CheckAuth";
import {
  getAllStudents,
  updateProfile,
  updateProfilePic,
} from "../controllers";

const router = express.Router();

router.get("/all", checkIsAuth, getAllStudents);
router.put("/pic", checkIsAuth, updateProfilePic);
router.put("/profile", checkIsAuth, updateProfile);
// router.get("/search", checkIsAuth, getStudentRecom);
// router.get("/students", checkIsAuth, getStudentRecom);

export { router as studentRouter };
