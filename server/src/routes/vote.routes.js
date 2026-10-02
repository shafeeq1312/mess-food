import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createVote, listMyVotes } from '../controllers/vote.controller.js';

const router = Router();
router.post('/', auth(['student']), createVote);
router.get('/mine', auth(['student']), listMyVotes);
export default router;