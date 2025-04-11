const pool = require('../config/db');
const achievementService = require('../services/achievementService');


// new message
const addChatMessage = async (request, response) => {
    const sender_id = request.user.id;
    const { group_id, message } = request.body;

    try {
        const result = await pool.query(
            "INSERT INTO chat_messages (sender_id, group_id, message) VALUES ($1, $2, $3) RETURNING *",
            [sender_id, group_id, message]
        );

        await achievementService.updateUserProgress(sender_id, 'message_sent', 1);

        return response.status(201).json({
            success: true,
            message: "Message added successfully",
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};


// get all messages in group
const getMessagesByGroupId = async (request, response) => {
    const { group_id } = request.body;

    try {
        const result = await pool.query(
        "SELECT * FROM chat_messages WHERE group_id = $1 ORDER BY created_at ASC",
        [group_id]
    );

    if (result.rowCount === 0) {
        return response.status(404).json({
            success: false,
            message: "No messages found for this group",
        });
    } else {
        return response.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: result.rows
        });
    }
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};


module.exports = {
    addChatMessage,
    getMessagesByGroupId
};