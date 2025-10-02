import { Router } from 'express';
import healthRoute from './health.js';

const router = Router();

router.use('/health', healthRoute);

export default router;
