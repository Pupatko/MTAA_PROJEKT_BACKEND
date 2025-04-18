const pool = require('../config/db');
const achievementService = require('../services/achievementService'); // Pridaný import achievementService

// Creation of group
const create = async (request, response) => {
    const { name, description } = request.body;
    const created_by = request.user.id;
    
    try {
        // User group owner verification
        const existingGroupQuery = await pool.query(
            "SELECT id FROM groups WHERE created_by = $1",
            [created_by]
        );
        
        if (existingGroupQuery.rowCount > 0) {
            return response.status(400).json({
                success: false,
                message: "User already created a group. Only one group per user is allowed.",
                existingGroupId: existingGroupQuery.rows[0].id
            });
        }
        
        // User group member verification
        const userGroupQuery = await pool.query(
            "SELECT group_id FROM users WHERE id = $1 AND group_id IS NOT NULL",
            [created_by]
        );
        
        if (userGroupQuery.rowCount > 0) {
            return response.status(400).json({
                success: false,
                message: "User is already a member of a group. Please leave the current group before creating a new one.",
                currentGroupId: userGroupQuery.rows[0].group_id
            });
        }

        // Create group and update user group id
        await pool.query('BEGIN');

        // Create group
        const result = await pool.query(
            "INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
            [name , description , created_by]
        );

        const newGroup = result.rows[0];
        await pool.query(
            "UPDATE users SET group_id = $1 WHERE id = $2",
            [newGroup.id, created_by]
        );

        await pool.query('COMMIT');

        return response.status(201).json({
            success: true,
            message: "Group created succesfully",
            data: result.rows[0]
    });
    
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        return response.status(500).send("ERROR !");
  }
};


// delete the group by id
const deleteGroup = async (request, response) => {
    const id = request.params.id;

    try {
        // To insure that all group members are removed from the group
        await pool.query('BEGIN');

        // Remove all members 
        await pool.query(
            "UPDATE users SET group_id = NULL WHERE group_id = $1",
            [id]
        );

        const result = await pool.query(
            "DELETE FROM groups WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            // Rollback the transaction if deletion fails
            await pool.query('ROLLBACK');
            return response.status(404).json({
                success: false,
                message: "Group not found",
            });
        }

        await pool.query('COMMIT');
        
        return response.status(200).json({
            success: true,
            message: "Group deleted succesfully"
        })
        
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};


// edit group name
const editName = async (request, response) => {
    const id = request.params.id;
    const { newName } = request.body;
  
    try {
        const result = await pool.query(
            "UPDATE groups SET name = $1 WHERE id = $2 RETURNING *",
            [newName , id]
        );
        
        return response.status(200).json({
            success: true,
            data: result.rows[0]
        })

    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};
  

// edit group name
const editDescription = async (request, response) => {
    const id = request.params.id;
    const { newDescription } = request.body;
  
    try {
        const result = await pool.query(
            "UPDATE groups SET description = $1 WHERE id = $2 RETURNING *",
            [newDescription , id]
        );
        
        return response.status(200).json({
            success: true,
            message: "Group description edited succesfully",
            data: result.rows[0]
        })
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};  


const removeMember = async (request, response) => {
    const group_id = request.params.id;
    const user_id = request.params.user_id;

    try {
        if (!id || !user_id) {
            return response.status(400).json({
                success: false,
                message: "Not provided group id or user_id",
            });
        }

        const result = await pool.query(
            "UPDATE users SET group_id = NULL WHERE id = $1 AND group_id = $2 RETURNING id",
            [user_id, group_id]
        );
        
        if (result.rowCount === 0) {
            return response.status(404).json({
                success: false,
                message: "Member not found in the group",
            });
        }
        return response.status(200).json({
            success: true,
            message: "Member deleted from the group",
        });
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR occured during deletion member from group.");
    }
};

const getAllGroups = async (request, response) => {
    try {
        const result = await pool.query("SELECT * FROM groups");

        if (result.rowCount === 0) {
            return response.status(404).json({
                success: false,
                message: "No groups found",
            });
        } else {
            return response.status(200).json({
                success: true,
                message: "Groups found",
                data: result.rows
            });
        }
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
}

const getGroupById = async (request, response) => {
    const id = request.params.id;

    try {
        const result = await pool.query("SELECT * FROM groups WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return response.status(404).json({
                success: false,
                message: "Group not found",
            });
        } else {
            return response.status(200).json({
                success: true,
                message: "Group found",
                data: result.rows[0]
            });
        }
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
}


const addMember = async (request, response) => {
    const group_id = request.params.id;
    const user_id = request.user.id; 

    try {
        if (!group_id || !user_id) {
            return response.status(400).json({
                success: false,
                message: "Not provided group id or user_id",
            });
        }

        const result = await pool.query(
            "UPDATE users SET group_id = $1 WHERE id = $2 RETURNING id, group_id",
            [group_id, user_id]
        );

        return response.status(201).json({
            success: true,
            message: "Member added to the group",
            data: result.rows[0]
        });
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR occured during adding member to group.");
    }
};

const getGroupMembers = async (request, response) => {
    const group_id = request.params.id;

    try {
        const result = await pool.query(
            "SELECT name, xp, created_at FROM users WHERE group_id = $1", 
            [group_id]
        );

        if (result.rowCount === 0) {
            return response.status(404).json({
                success: false,
                message: "No members in the group",
            });
        } else {
            return response.status(200).json({
                success: true,
                message: "Members found in the group ^^",
                data: result.rows
            });
        }
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
}


module.exports = {
    create,
    deleteGroup,
    editName,
    editDescription,
    removeMember, 
    getAllGroups,
    getGroupById,
    addMember,
    getGroupMembers,
};