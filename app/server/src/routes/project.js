import { Router } from 'express';
import { scanProject, executeTask, fetchCommunityFiles } from '../controllers/projectController.js';

const router = Router();

router.post('/scan', scanProject);
router.post('/execute', executeTask);
router.post('/fetch-files', fetchCommunityFiles);

export default router;