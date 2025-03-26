const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
  user: process.env.POSTGRE_USER ,
  host: process.env.POSTGRE_HOST ,
  database: process.env.POSTGRE_DATABASE ,
  password: process.env.POSTGRE_PASSWORD
})

// registration of USER
const registerUser = async (reqest , response) => {
    const { name , password } = reqest.body;
    
    try {
        const result = await pool.query('INSERT INTO users (name , password) VALUES ($1, $2)', [name , password]);
        response.status(201).json(result.rows[0]);
        console.log("New user successfully registered, name: " , name)
    } catch (err) {
        console.error(err);
        response.status(500).send('Error creating user');
    }
};

module.exports = {
  registerUser
}