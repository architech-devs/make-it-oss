import express from "express";
import {
  githubLogin,
  githubCallback,
  getCurrentUser,
  logoutUser,
} from "../auth/githubOAuth.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logoutUser);

export default router;
