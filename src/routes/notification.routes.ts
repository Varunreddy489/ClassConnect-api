import express from "express";

import {
  deleteNotification,
  getAllNotifications,
  markNotificationAsRead,
} from "../controllers";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.get("/", checkIsAuth, getAllNotifications);
router.delete("/:id", checkIsAuth, deleteNotification);
router.put("/:id", checkIsAuth, markNotificationAsRead);

export { router as notificationRouter };
