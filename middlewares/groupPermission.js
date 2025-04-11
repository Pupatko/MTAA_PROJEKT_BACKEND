const pool = require('../config/db');

const isGroupCreator = async (req, res, next) => {
    const id = req.body.id;
    const user_id = req.user.id;
    
    if (!id || !user_id) { // check thet request contains group id and user id
        return res.status(400).json({
            success: false,
            message: "Missing required parameters for user(group id, user id)"
        });
    }
    
    try {
        const isGroupExist = await pool.query(
            "SELECT created_by FROM groups WHERE id = $1", [id]
        ); // select the group by id

        if (isGroupExist.rowCount === 0) { // check existence of group
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        if (isGroupExist.rows[0].created_by !== user_id) { // check that group was created by the user with user_id
            return res.status(403).json({
                success: false,
                message: "Permission denied: only group creator can perform this action"
            });
        }

        next();
    } catch (err) {
        // log occurred error
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error during checking permissions: " + err.message,
        });
    }
};

const isGroupMember = async (req, res, next) => {
    const id = req.params.id; // groups/:id
    const user_id = req.user.id;
    
    if (!id || !user_id) { // check thet request contains group id and user id
        return res.status(400).json({
            success: false,
            message: "Missing required parameters for user(group id, user id)"
        });
    }

    try {
        const isGroupExist = await pool.query(
            "SELECT created_by FROM groups WHERE id = $1", [id]
        ); // select the group by id

        if (isGroupExist.rowCount === 0) { // check existence of group
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        const isGroupMember = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND group_id = $2",
            [user_id, id]
        ); // check that use is a group member
        if (isGroupMember.rowCount === 0) {
            return res.status(403).json({
                success: false,
                message: "Permission denied: user is not a group member"
            });
        }

        next();
    } catch (err) { 
        // log occurred error
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error during checking permissions: " + err.message,
        });
    }
}

module.exports = { 
    isGroupCreator,
    isGroupMember
 };