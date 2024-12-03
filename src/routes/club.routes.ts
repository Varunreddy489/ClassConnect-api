import express from "express";

import {
    exitClub,
    addToClub,
    createClub,
    deleteClub,
    updateClub,
    getAllClubs,
    getClubById,
    getUserClubs,
    removeMember,
    joinClubRequest,
    rejectJoinRequest,
    userCreatedClubs,
    acceptJoinRequest,
    getAllJoinRequests,
} from "../controllers";
import { checkIsAuth } from "../middleware/CheckAuth";

const router = express.Router();

router.get("/club", checkIsAuth, getAllClubs);
router.get("/user/club", checkIsAuth, getUserClubs);
router.post("/club/create", checkIsAuth, createClub);
router.delete("/club/:clubId", checkIsAuth, deleteClub);
router.put("/club/update/:clubId", checkIsAuth, updateClub);
router.get("/club/details/:clubId", checkIsAuth, getClubById);

// * Club Ops

router.put("/club/add/:clubId", checkIsAuth, addToClub);
router.get("/club/user", checkIsAuth, userCreatedClubs);
router.post("/club/join/:clubId", checkIsAuth, joinClubRequest);
router.get("/club/join/:clubId", checkIsAuth, getAllJoinRequests);
router.post("/club/accept/:clubId", checkIsAuth, acceptJoinRequest);

//  Todo

router.post("/club/check/:clubId", checkIsAuth, exitClub);
router.delete("/club/remove/:clubId", checkIsAuth, removeMember);
router.post("/club/reject/:clubId", checkIsAuth, rejectJoinRequest);

export {router as clubRouter}
