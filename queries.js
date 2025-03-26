const Pool = require('pg').Pool
const bcrypt = require('bcryptjs');
const { request } = require('express');
require('dotenv').config()


const pool = new Pool({
  user: process.env.POSTGRE_USER ,
  host: process.env.POSTGRE_HOST ,
  database: process.env.POSTGRE_DATABASE ,
  password: process.env.POSTGRE_PASSWORD ,
  port: process.env.POSTGRE_PORT
})


// registration of user
const registerUser = async (reqest , response) => {
  const { name , password } = reqest.body;
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  try {
      const result = await pool.query("INSERT INTO users (name , password) VALUES ($1, $2) RETURNING *", [name , hashed_password]);
      console.log("(201) Nice 1 - registration of user");
      return response.status(201).json({
        success: true,
        message: "User successfully registered",
        data: result.rows[0]
    });
    
  } catch (err) {
      console.error(err);
      console.log("(500) Bad 1 - registration of user");
      return response.status(500).send("ERROR !");
  }
};


// login of user
const loginUser = async (request, response) => {
  const { name , password } = request.body;
      
  try {
    const userInfo = await pool.query("SELECT * FROM users WHERE name = $1", [name]);
    
    if (userInfo.rowCount === 0) {
      console.log("(404) Bad 1 - login of user");
      return response.status(404).send("User does not exist");
    }
    const user = userInfo.rows[0];
    const result = await bcrypt.compare(password , user.password);
    
    if (result) {
      console.log("(200) Nice 1 - login of user");
      return response.status(200).json({
        success: true,
        message: "User successfully logged in",
        data: userInfo.rows[0]
      });
      
    } else {
      console.log("(400) Bad 2 - login of user");
      return response.status(400).send(result);
    }
    
  } catch (err) {
    console.error(err);
    console.log("(500) Bad 3 - login of user (propably the same username)");
    return response.status(500).send("ERROR !");
  }
}

module.exports = {
  registerUser,
  loginUser
}