import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createFeedback, deleteFeedback, listMyFeedback } from '../controllers/feedback.controller.js';

const router = Router();
router.post('/', auth(['student']), createFeedback);
router.get('/mine', auth(['student']), listMyFeedback);
router.delete('/:id', auth(['admin']), deleteFeedback);
export default router;