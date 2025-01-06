import express from "express";

import {
  sendFiles,
  sendMessages,
  getAllMessages,
  removeMessages,
  markMessageAsSeen,
} from "../controllers";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.post("/club/file/:clubId", checkIsAuth, sendFiles);
router.delete("/club/:clubId", checkIsAuth, removeMessages);
router.post("/club/message/:clubId", checkIsAuth, sendMessages);
router.get("/club/message/:clubId", checkIsAuth, getAllMessages);
router.put("/user/message/:messageId", checkIsAuth, markMessageAsSeen);



export { router as messageRouter };
