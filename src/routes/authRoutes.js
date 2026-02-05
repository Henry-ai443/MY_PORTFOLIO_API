import express from "express";
import { signup, login, me, signupAllowed } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/signup-allowed", signupAllowed);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);

export default router;
