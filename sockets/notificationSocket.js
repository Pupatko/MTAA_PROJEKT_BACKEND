const pool = require('../config/db');
const WebSocket = require('ws');

// Users connections 
const userConnections = new Map();

// To add a new data to the map, use: 
// userConnections.set(userId, socket);
// Tp get the data:
// const connections = userConnections.get(userId);
// To delete the data from the map, use:
// userConnections.delete(userId);

// For itereate over the map, use:
// for (const [key, value] of userConnections)

function initializeNotificationSocket(wss) {
  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        const event = data.event;
        const payload = data.data;

        if (event === 'startNotifications') {
          const { user_id } = payload;

          if (!user_id) {
            console.warn("Missing user_id for notification");
            return;
          }

          ws.notification_user_id = user_id;
        
          if (!userConnections.has(user_id)) {
            userConnections.set(user_id, new Set());
          }
          userConnections.get(user_id).add(ws);

          // Send existing notifications to the user, that are not read yet
          const notifications = await pool.query(
            `SELECT id, message, created_at 
            FROM notifications 
            WHERE user_id = $1 AND is_read = FALSE 
            ORDER BY created_at DESC`,
            [user_id]
          );

          // Use JSON.stringify to convert to a string with JSON format
          ws.send(JSON.stringify({
            event: 'notificationHistory',
            data: notifications.rows
          }));
        }

        if (event === 'markAsRead') {
          const { notification_id } = payload;
          const user_id = ws.notification_user_id;

          if (!user_id || !notification_id) {
            console.warn('Missing user_id or notification_id');
            return;
          }

          await pool.query(
            `UPDATE notifications 
             SET is_read = TRUE 
             WHERE id = $1 AND user_id = $2`, 
             [notification_id, user_id]
          );

          ws.send(JSON.stringify({
            event: 'notificationMarkedAsRead',
            data: { 
                id: notification_id 
            }
          }));
        }
      } catch (e) {
        console.error('Error processing notification:', e);
      }
    });

    ws.on('close', () => {
      // Delete the connection from the userConnections map
      if (ws.notification_user_id) {
        const userId = ws.notification_user_id;
        if (userConnections.has(userId)) {
          userConnections.get(userId).delete(ws);
        
          if (userConnections.get(userId).size === 0) {
            userConnections.delete(userId);
          }
        }
      }
    });
  });
}


function sendNotification(userId, notification) {
  if (userConnections.has(userId)) {
    const connections = userConnections.get(userId);

    // For each user connection control that the connection is open and send the notification
    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          event: 'newNotification',
          data: notification
        }));
      }
    });
  }
}

module.exports = {
  initializeNotificationSocket,
  sendNotification
}; 