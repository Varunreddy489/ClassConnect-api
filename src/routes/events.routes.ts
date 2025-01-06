import express from "express";

import { checkIsAuth } from "../middleware/CheckAuth";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
} from "../controllers/events.controller";

const router = express.Router();

router.get("/", checkIsAuth, getAllEvents);
router.post("/", checkIsAuth, createEvent);
router.get("/", checkIsAuth, getEventById);
router.get("/", checkIsAuth, deleteEvent);

export { router as eventsRouter };
