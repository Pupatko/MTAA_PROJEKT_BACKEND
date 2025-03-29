const Pool = require('pg').Pool
const bcrypt = require('bcryptjs');
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const pool = new Pool({
  user: process.env.POSTGRE_USER ,
  host: process.env.POSTGRE_HOST ,
  database: process.env.POSTGRE_DATABASE ,
  password: process.env.POSTGRE_PASSWORD ,
  port: process.env.POSTGRE_PORT
});


// registration of user
const registerUser = async (request , response) => {
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
const loginUser = async (request, response) => {
  const { name , password } = request.body;
      
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE name = $1", [name]);
    
    if (userInfo.rowCount === 0) {
      return response.status(404).send("User does not exist");
    }
    const user = userInfo.rows[0];
    const result = await bcrypt.compare(password , user.password);
    
    if (result) {
      return response.status(200).json({
        success: true,
        message: "User successfully logged in",
        data: userInfo.rows[0]
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


module.exports = {
  registerUser,
  loginUser
}