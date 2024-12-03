import express from "express";

import { checkIsAuth } from "../middleware/CheckAuth";
import { fetchStats } from "../controllers/stats.controller";

const router = express.Router();

router.get("/", checkIsAuth, fetchStats);

export { router as statsRouter };
