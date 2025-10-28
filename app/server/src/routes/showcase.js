import { Router } from 'express';
import { adminAuth } from '../middlewares/auth.js';
import { getCurrentWeekShowcase, getFeaturedSubmission, getSubmissions, Submission, submitApprovedSubmission, submitRejectedSubmission } from '../controllers/showcaseController.js';


const router = Router();

router.post("/submit", Submission);
router.get("/submissions", adminAuth, getSubmissions);
router.put("/submissions/:id/approve", adminAuth, submitApprovedSubmission);
router.put("/submissions/:id/reject", adminAuth, submitRejectedSubmission);
router.get("/current", getCurrentWeekShowcase);
router.get("/featured", getFeaturedSubmission);

export default router;