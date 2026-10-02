import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createMenu, deleteMenu, listPublishedMenus, openFeedback, publishMenu, serveMenu, updateMenu } from '../controllers/menu.controller.js';

const router = Router();
router.get('/', auth(), listPublishedMenus);
router.post('/', auth(['admin']), createMenu);
router.patch('/:id', auth(['admin']), updateMenu);
router.delete('/:id', auth(['admin']), deleteMenu);
router.patch('/:id/publish', auth(['admin']), publishMenu);
router.patch('/:id/served', auth(['admin']), serveMenu);
router.patch('/:id/open-feedback', auth(['admin']), openFeedback);
export default router;