import express, { RequestHandler } from "express";
import { register, login, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Cast to RequestHandler to satisfy TypeScript
router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.get("/me", protect as RequestHandler, getMe as RequestHandler);

export default router;
