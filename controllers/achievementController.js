const pool = require('../config/db');


// get Achievements
const getAllAchievements = async (request, response) => {
    
  try {
    const result = await pool.query("SELECT * FROM achievements");
    
    if (result.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: "No achievements found"
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Achievements found",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};


// get Achievements
const getUserAchievements = async (request, response) => {
    const { user_id } = request.body;
    
    try {
      const result = await pool.query("SELECT * FROM user_achievements WHERE user_id = $1", [user_id]);
      
      if (result.rowCount === 0) {
        return response.status(404).json({
          success: false,
          message: "No achievements found for the user"
        });
      } else {
        return response.status(200).json({
          success: true,
          message: "Achievements found for the user",
          data: result.rows
        });
      }
      
    } catch (err) {
      console.error(err);
      return response.status(500).send("ERROR !");
    }
  };
  

module.exports = {
  getAllAchievements,
  getUserAchievements
};
