import { Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Notification } from '../entity/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

const notifRepo = () => AppDataSource.getRepository(Notification);

// ─── GET /api/notifications ───────────────────────────────────────────────────
export const getAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { read } = req.query as Record<string, string>;

    const where: any = {};
    if (read === 'true') where.read = true;
    if (read === 'false') where.read = false;

    const notifications = await notifRepo().find({
      where,
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await notifRepo().count({ where: { read: false } });

    res.status(200).json({
      success: true,
      data: { notifications, unreadCount },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications.', error });
  }
};

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notif = await notifRepo().findOne({
      where: { id: Number(req.params.id) }
    }); if (!notif) {
      res.status(404).json({ success: false, message: 'Notification not found.' });
      return;
    }

    notif.read = true;
    await notifRepo().save(notif);

    res.status(200).json({ success: true, message: 'Notification marked as read.', data: notif });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification.', error });
  }
};

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await notifRepo()
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('read = false')
      .execute();

    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notifications.', error });
  }
};