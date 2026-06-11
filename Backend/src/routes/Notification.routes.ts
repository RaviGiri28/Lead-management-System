import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getAllNotifications, markAllAsRead, markAsRead } from '../controllers/Notification.controller';
const router = Router();

router.use(authMiddleware);

router.get('/',                getAllNotifications);
router.patch('/read-all',      markAllAsRead);
router.patch('/:id/read',      markAsRead);

export default router;