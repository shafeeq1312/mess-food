import { Router } from 'express';
import auth from '../middleware/auth.js';
import { overview } from '../controllers/admin.controller.js';

const router = Router();
router.get('/overview', auth(['admin']), overview);
export default router;