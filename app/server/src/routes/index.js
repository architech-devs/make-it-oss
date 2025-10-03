import { Router } from 'express';
import healthRoute from './health.js';
import projectRoute from './project.js';

const router = Router();

router.use('/health', healthRoute);
router.use('/project', projectRoute);

export default router;
