import { Router } from "express";
import { authorize } from "../middleware/authMiddleware.js";
import { getUsers, getUserProfile } from "../controllers/user.controller.js";

const router = Router();

router.get("/", authorize(['admin']), getUsers);
router.get("/profile", getUserProfile);

export default router;