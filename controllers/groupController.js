const pool = require('../config/db');

//TODO: add verification of existing user group, only one gorup 

// TOTO HANDLOVAT NA FRONTENDE - ze , 
// new group
const create = async (request, response) => {
    const { created_by , name , description } = request.body;
    
    try {
        const result = await pool.query(
            "INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
            [name , description , created_by]
        );

        return response.status(201).json({
            success: true,
            message: "Group created succesfully",
            data: result.rows[0]
    });
    
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
  }
};

// ! (only admin can change group name)
// delete the group by id
const deleteGroup = async (request, response) => {
  const { id } = request.body;

    try {
        const result = await pool.query(
            "DELETE FROM groups WHERE id = $1",
            [id]
        );
        
        return response.status(200).json({
            success: true,
            message: "Group deleted succesfully"
        })
        
    } catch (err) {
        console.error(err);
        return response.status(500).send("ERROR !");
    }
};


// ! (only admin can change group name)
// edit group name
const editName = async (request, response) => {
    const { id , newName } = request.body;
  
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
  

// ! (only admin can change group name)
// edit group name
const editDescription = async (request, response) => {
    const { id , newDescription } = request.body;
  
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


module.exports = {
    create,
    deleteGroup,
    editName,
    editDescription
};