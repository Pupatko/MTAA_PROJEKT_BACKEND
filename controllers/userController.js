const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateTokens');


// registration of user
const register = async (request , response) => {
  const { name , password } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  try {
      const result = await pool.query("INSERT INTO users (name , password) VALUES ($1, $2) RETURNING *", [name , hashed_password]);
      return response.status(201).json({
        success: true,
        message: "User successfully registered",
        data: result.rows[0]
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
      
      return response.status(200).json({
        success: true,
        message: "User successfully logged in",
        data: userInfo.rows[0],
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



// kontrola existencii mena ci eemail(MUSI zmenit ak uz take meno ezistuje)
// edit user name
const editName = async (request, response) => {
  const { id, newName } = request.body;
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

    const result = await pool.query("UPDATE users SET name = $1 WHERE id = $2 RETURNING *", [newName, id]);
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

const editEmail = async (request, response) => {
  const { id, newEmail } = request.body;
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    }

    // Check if the user with the new email already exists in DBS
    const isEmailFree = await pool.query("SELECT * FROM users WHERE email = $1", [newEmail]);
    if (isEmailFree.rowCount > 0) {
      return response.status(400).send("This email is already taken");
    }

    const result = await pool.query("UPDATE users SET email = $1 WHERE id = $2 RETURNING *", [newEmail, id]);
    return response.status(200).json({
      success: true,
      message: "User email updated successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }

}


// edit user password
const editPassword = async (request, response) => {
  const { id, newPassword } = request.body;
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const result = await pool.query("UPDATE users SET password = $1 WHERE id = $2 RETURNING *", [hashedPassword, id]);
    
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
  const { id } = request.body;
  
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
    // TU PRIDAT QUERINU NA STATS (lebo chcem profile , ale linknem to neskor (pre skusku))
    const userInfo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (userInfo.rowCount === 0) {
      return response.status(404).send("User not found");
    };
    
    return response.status(200).json({
      success: true,
      message: "User found, profile shared",
      data: userInfo.rows[0]
    });
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};

module.exports = {
  register,
  login,
  editName,
  editEmail,
  editPassword,
  deleteUser,
  profile,
  logout
}