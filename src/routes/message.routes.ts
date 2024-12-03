import express from "express";

import {
  sendFiles,
  sendMessages,
  getAllMessages,
  removeMessages,
} from "../controllers";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.post("/club/file/:clubId", checkIsAuth, sendFiles);
router.delete("/club/:clubId", checkIsAuth, removeMessages);
router.post("/club/message/:clubId", checkIsAuth, sendMessages);
router.get("/club/message/:clubId", checkIsAuth, getAllMessages);

router.get("/user/message/:userId", checkIsAuth, getAllMessages);



export { router as messageRouter };
