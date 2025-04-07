const pool = require('../config/db');

function initializeChatSocket(io) {
  io.on('connection', async (socket) => {

    socket.on('joinGroup', async (data) => {
      try {
        const { group_id, user_id } = data;

        if (!group_id || !user_id) {
            // Use socket.emit to send event to the client
            // Don't send message to the client about the occured error
            // socket.emit('error');
            console.warn("Not correct data(group_id and user_id)")
            return;
        }

        const isGroupExist = await pool.query(
            "SELECT created_by FROM groups WHERE id = $1", [group_id]
        ); // select the group by id

        if (isGroupExist.rowCount === 0) { // check existence of group
            console.warn("Group not found");
            return;
        }

        const isGroupMember = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND group_id = $2",
            [user_id, group_id]
        ); // check that use is a group member

        if (isGroupMember.rowCount === 0) {
            console.warn('User is not a group member');
            return;
        }

        // Connect user to the group room
        socket.join(`group:${group_id}`);

        // Save data in socket
        socket.data.group_id = group_id;
        socket.data.user_id = user_id;

        // Load the group history of message
        const messages = await pool.query(
            'SELECT c_message.id, c_message.sender_id, c_message.message, c_message.created_at, u.name as sender_name ' +
            'FROM chat_messages c_message ' +
            'JOIN users u ON c_message.sender_id = u.id ' +
            'WHERE c_message.group_id = $1 ' +
            'ORDER BY c_message.created_at ASC',
            [group_id]
        );

        socket.emit('chatHistory', messages.rows);

      } catch (err) {
        console.error('Error joining group:', err);
      }
    });

    // Sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { message } = data;
        const group_id = socket.data.group_id;
        const user_id = socket.data.user_id;

        if (!group_id || !user_id) {
          console.error('User must join a group first');
          return;
        }

        if (!message || message.trim() === '') {
          console.error('Message cannot be empty');
          return;
        }

        // Save message in the database
        const queryResult = await pool.query(
          'INSERT INTO chat_messages(sender_id, group_id, message) VALUES($1, $2, $3) RETURNING id, created_at',
          [user_id, group_id, message]
        );

        const messageId = queryResult.rows[0].id;
        const timestamp = queryResult.rows[0].created_at;

        // Retrieve sender name to display
        const sender = await pool.query('SELECT name FROM users WHERE id = $1', [user_id]);
        const senderName = sender.rows[0].name;

        // Send message to all group members
        io.to(`group:${group_id}`).emit('newMessage', {
          id: messageId,
          sender_id: user_id,
          sender_name: senderName,
          group_id: group_id,
          message: message,
          created_at: timestamp,
        });

      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    // User disconnection, not necessarily to have this block of code 
    socket.on('disconnect', () => {
        delete socket.data.group_id;
        delete socket.data.user_id;
    });
  });
}

module.exports = {
    initializeChatSocket
}