import { Router } from 'express';
import { scanProject, executeTask } from '../controllers/projectController.js';

const router = Router();

router.post('/scan', scanProject);
router.post('/execute', executeTask);

export default router;

