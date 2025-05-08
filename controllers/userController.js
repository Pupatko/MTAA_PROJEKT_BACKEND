const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const generateTokens = require('../utils/generateTokens');
const achievementService = require('../services/achievementService');


// registration of user
const register = async (request, response) => {
  const { name, password } = request.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    
    if (existingUser.rowCount > 0) {
      return response.status(409).json({
        success: false,
        message: "Username already exists"
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id, name, xp, created_at",
      [name, hashed_password]
    );

    const newUserId = result.rows[0].id;

    // Initialize user progress for achievements
    await achievementService.initializeUserProgress(newUserId);

    return response.status(201).json({
      success: true,
      message: "User successfully registered",
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};


// login of user
const login = async (request, response) => {
  const { name , password } = request.body;
      
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE name = $1", [name]);
    
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User does not exist");
    }
    const user = userInfo.rows[0];
    const result = await bcrypt.compare(password , user.password);
    
    if (result) {
      
      // generation of JWT tokens
      const { accessToken , refreshToken } = generateTokens(userInfo.rows[0].id);
      
      response.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true
        sameSite: 'strict',
        maxAge: 20 * 60 * 1000, // na testovanie 10 min
      });

      await achievementService.updateUserProgress(user.id, 'login_count', 1);

      const userInfoWithoutPassword = await pool.query(
        "SELECT id, name, xp, created_at, group_id FROM users WHERE id = $1", 
        [user.id]
      );
      
      return response.status(200).json({
        success: true,
        message: "User successfully logged in",
        data: userInfoWithoutPassword.rows[0],
        accessToken: accessToken,
      });
 
    } else {
      return response.status(400).json({
        success: false,
        message: "User failed to log in",
      });
    }
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};

// logout of user
const logout = async (request, response) => {
  try {
    // deleting token
    response.clearCookie('refreshToken', {
      httpOnly: true,
      // secure: true
      sameSite: 'strict',
    });

    return response.status(200).json({
      success: true,
      message: "User successfully logged out",
    });

  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};

// edit user name
const editName = async (request, response) => {
  const { newName } = request.body;
  const id = request.user.id;

  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    }

    // Check if the user with the new name already exists in DBS
    const isNameFree = await pool.query("SELECT * FROM users WHERE name = $1", [newName]);
    if (isNameFree.rowCount > 0) {
      return response.status(400).send("This name is already taken");
    }

    const result = await pool.query("UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, xp, created_at", [newName, id]);
    return response.status(200).json({
      success: true,
      message: "User name updated successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};

// edit user password
const editPassword = async (request, response) => {
  const { newPassword } = request.body;
  const id = request.user.id;
  
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING id, name, xp, created_at", [hashedPassword, id]);
    
    return response.status(200).json({
      success: true,
      message: "User password updated successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};


// delete user
const deleteUser = async (request, response) => {
  const { id } = request.user.id;
  
  try {
    
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    }
    
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    
    return response.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};


// get profile information
const profile =  async (request, response) => {
  const id = request.user.id;
  
  try {
    const userInfo = await pool.query(
      "SELECT id, xp, group_id, name, created_at FROM users WHERE id = $1", 
      [id]
    );

    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    };

    const messageCountQuery = await pool.query(
      'SELECT COUNT(*) FROM chat_messages WHERE sender_id = $1', 
      [id]
    );
    
    const messageCount = parseInt(messageCountQuery.rows[0].count || '0');
    
    const achievementsCountQuery = await pool.query(
      'SELECT COUNT(*) FROM user_achievements WHERE user_id = $1', 
      [id]
    );

    const achievementsQuery = await pool.query(`
      SELECT 
        a.id, 
        a.title,
        a.description, 
        a.condition_type,
        a.condition_value,
        a.icon_path,
        (
          CASE WHEN ua.user_id IS NOT NULL THEN true
            ELSE false
          END
        ) AS unlocked,
        ua.achieved_at,
        uap.current_value,
        uap.last_updated,
        (
          CASE 
            WHEN ua.user_id IS NOT NULL THEN 100
            WHEN uap.current_value IS NOT NULL AND a.condition_value > 0 
              THEN LEAST(100, ROUND((uap.current_value * 100.0) / a.condition_value))
            ELSE 0
          END 
        ) AS progress_percent
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      LEFT JOIN user_achievement_progress uap ON a.condition_type = uap.condition_type AND uap.user_id = $1
      ORDER BY a.condition_type, a.condition_value`,
      [id]
    );

    const stats = {
      message_count: messageCount,
      achievements_count: parseInt(achievementsCountQuery.rows[0].count || '0')
    };
    
    return response.status(200).json({
      success: true,
      message: "User found, profile shared",
      data: userInfo.rows[0],
      stats: stats,
      achievements: achievementsQuery.rows
    });
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("Error to get user profile.");
  }
};

module.exports = {
  register,
  login,
  editName,
  editPassword,
  deleteUser,
  profile,
  logout
}