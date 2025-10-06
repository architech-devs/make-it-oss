import express from "express";
import { getHealth } from "../controllers/healthController.js";
import { dbHealthCheck } from '../controllers/healthController.js';

const router = express.Router();

router.get("/", getHealth);
router.get('/db', dbHealthCheck);

export default router;



