import express from "express";

import {
  searchUser,
  acceptFriendRequest,
  rejectFriendRequest,
  sendConnectionRequest,
  getSuggestedConnections,
} from "../controllers";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.post("/search", checkIsAuth, searchUser);
router.get("/suggestions", checkIsAuth, getSuggestedConnections);
router.post("/request/:userId", checkIsAuth, sendConnectionRequest);
router.put("/request/accept/:connectionId", checkIsAuth, acceptFriendRequest);
router.put("/request/reject/:connectionId", checkIsAuth, rejectFriendRequest);

export { router as connectionRouter };
