import express from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  getUserRepos,
  getUserOrgs,
  getOrgRepos,
} from "../controllers/githubController.js";

const router = express.Router();

router.get("/repos", authenticate, getUserRepos);
router.get("/orgs", authenticate, getUserOrgs);
router.get("/orgs/:org/repos", authenticate, getOrgRepos);

export default router;
