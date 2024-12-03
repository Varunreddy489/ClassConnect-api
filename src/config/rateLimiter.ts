import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
