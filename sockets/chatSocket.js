const pool = require('../config/db');
const WebSocket = require('ws');
const achievementService = require('../services/achievementService');

function initializeChatSocket(wss) {
  wss.on('connection', (ws) => {

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        const event = data.event;
        const payload = data.data;

        if (event === 'joinGroup') {
          const { group_id, user_id } = payload;

          if (!group_id || !user_id) {
            console.warn("Not correct data (group_id and user_id)");
            return;
          }

          const isGroupExist = await pool.query(
            "SELECT created_by FROM groups WHERE id = $1",
            [group_id]
          );

          if (isGroupExist.rowCount === 0) {
            console.warn("Group not found");
            return;
          }

          const isGroupMember = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND group_id = $2",
            [user_id, group_id]
          );

          if (isGroupMember.rowCount === 0) {
            console.warn('User is not a group member');
            return;
          }

          ws.group_id = group_id;
          ws.user_id = user_id;

          const messages = await pool.query(
            'SELECT c_message.id, c_message.sender_id, c_message.message, c_message.created_at, u.name as sender_name ' +
            'FROM chat_messages c_message ' +
            'JOIN users u ON c_message.sender_id = u.id ' +
            'WHERE c_message.group_id = $1 ' +
            'ORDER BY c_message.created_at ASC',
            [group_id]
          );

          ws.send(JSON.stringify({
            event: 'chatHistory',
            data: messages.rows
          }));
        }

        if (event === 'sendMessage') {
          const { message } = payload;
          const group_id = ws.group_id;
          const user_id = ws.user_id;

          if (!group_id || !user_id) {
            console.error('User must join a group first');
            return;
          }

          if (!message || message.trim() === '') {
            console.error('Message cannot be empty');
            return;
          }

          const queryResult = await pool.query(
            'INSERT INTO chat_messages(sender_id, group_id, message) VALUES($1, $2, $3) RETURNING id, created_at',
            [user_id, group_id, message]
          );

          try {
            await achievementService.updateUserProgress(user_id, 'message_sent', 1);
          } catch (e) {
            console.error('Error updating achievement progress:', e);
          }

          const messageId = queryResult.rows[0].id;
          const timestamp = queryResult.rows[0].created_at;

          const sender = await pool.query('SELECT name FROM users WHERE id = $1', [user_id]);
          const senderName = sender.rows[0].name;

          const newMessage = {
            id: messageId,
            sender_id: user_id,
            sender_name: senderName,
            group_id: group_id,
            message: message,
            created_at: timestamp,
          };

          wss.clients.forEach((client) => {
            if (client.group_id === group_id && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                event: 'newMessage',
                data: newMessage
              }));
            }
          });
        }
      } catch (e) {
        console.error('Error processing message:', e);
      }
    });

    ws.on('close', () => {
      delete ws.group_id;
      delete ws.user_id;
    });
  });
}

module.exports = {
  initializeChatSocket
};