import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getAllNotifications, markAllAsRead, markAsRead } from '../controllers/Notification.controller';
const router = Router();

router.get('/', authMiddleware, getAllNotifications);
router.patch('/read-all', authMiddleware, markAllAsRead);
router.patch('/:id/read', authMiddleware, markAsRead);

export default router;
