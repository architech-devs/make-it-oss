import { Router } from 'express';
import { scanProject, executeTask, fetchCommunityFiles, analyzeOSSReadiness } from '../controllers/projectController.js';

const router = Router();

router.post('/scan', scanProject);
router.post('/execute', executeTask);
router.post('/fetch-files', fetchCommunityFiles);
router.post('/analyze-oss', analyzeOSSReadiness);

export default router;