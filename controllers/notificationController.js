const pool = require('../config/db');

const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await pool.query(
            `SELECT id, message, created_at, is_read 
            FROM notifications 
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]
        );

        if (notifications.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found'
            });
        }

        return res.status(200).json({
            success: true,
            message: "User notifications retrieved successfully",
            data: notifications.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ 
            success: false,
            message: "Server error to get all user notifications" 
        });
    }
}

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or already was read'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as readed",
            data: { 
                id: result.rows[0].id 
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ 
            success: false,
            message: "Server error to read user notification" 
        });
    }
} 

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE RETURNING id',
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: 'Notifications marked as readed',
            data: { 
                count: result.rows.length 
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ 
            saccess: false,
            message: "Server error to mark all notifications as readed" 
        });
    }
}

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: { 
                id: result.rows[0].id 
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ 
            success: false,
            message: "Server error to delete notification" 
        });
    }
}

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
}