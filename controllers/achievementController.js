const pool = require('../config/db');

// Get all achievements for the logged-in user with their unlock status
const getAllAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const achievementsQuery = await pool.query(`
      SELECT 
      a.id, 
      a.title,
      a.description, 
      a.condition_type,
      a.condition_value,
      a.icon_path,
      (
        CASE WHEN ua.user_id IS NOT NULL 
        THEN true
        ELSE false END
      ) AS unlocked,
      ua.achieved_at,
      uap.current_value,
      uap.last_updated
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      LEFT JOIN user_achievement_progress uap ON a.condition_type = uap.condition_type AND uap.user_id = $1
      ORDER BY a.condition_type, a.condition_value
      `, [userId]
    );
    
    // Grouping achievements by condition type
    const groupedAchievements = achievementsQuery.rows.reduce((groups, achievement) => {
      const type = achievement.condition_type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(achievement);
      return groups;
    }, {});
    
    res.status(200).json({
      success: true,
      achievements: achievementsQuery.rows,
      groupedAchievements: groupedAchievements
    });
  } catch (e) {
    console.error('Error getting achievements:', e);
    res.status(500).json({
      success: false,
      message: 'Error getting achievements',
    });
  }
};

// Retrieve a specific achievement by ID for the logged-in user with details
const getAchievement = async (req, res) => {
  try {
    const achievementId = req.params.id;
    const userId = req.user.id;
    
    // Get the achievement details for user with unlock status
    const achievementQuery = await pool.query(`
      SELECT 
        a.id, 
        a.title,
        a.description, 
        a.condition_type,
        a.condition_value,
        a.icon_path,
        (
          CASE WHEN ua.user_id IS NOT NULL
            THEN true
          ELSE false END
        ) AS unlocked,
        ua.achieved_at,
        uap.current_value,
        uap.last_updated
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      LEFT JOIN user_achievement_progress uap ON a.condition_type = uap.condition_type AND uap.user_id = $1
      WHERE a.id = $2
    `, [userId, achievementId]);
    
    if (achievementQuery.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    
    // Calculate the progress percentage
    const achievement = achievementQuery.rows[0];
    if (achievement.current_value !== null && achievement.condition_value > 0) {
      achievement.progress_percent = Math.min(100, Math.round((achievement.current_value / achievement.condition_value) * 100));
    } else {
      achievement.progress_percent = achievement.unlocked ? 100 : 0;
    }
    
    res.status(200).json({
      success: true,
      achievement: achievement
    });
  } catch (e) {
    console.error('Error getting achievement:', e);
    res.status(500).json({
      success: false,
      message: 'Error getting achievement'
    });
  }
};


// Get user achievements with unlock status and progress values
// Get information about everyone user 
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.params.userID;
     
    // Get user achievements with unlock status
    const achievementsQuery = await pool.query(`
      SELECT 
        a.id, 
        a.title,
        a.description,
        a.condition_type,
        a.condition_value,
        a.icon_path,
        ua.achieved_at
      FROM achievements a
      JOIN user_achievements ua ON a.id = ua.achievement_id
      WHERE ua.user_id = $1
      ORDER BY ua.achieved_at DESC
    `, [userId]);
    
    // Get user progress 
    const progressQuery = await pool.query(`
      SELECT 
        condition_type, 
        current_value, 
        last_updated
      FROM user_achievement_progress
      WHERE user_id = $1
    `, [userId]);
    
    // Structure progress data
    const progressMap = {};
    progressQuery.rows.forEach(item => {
      progressMap[item.condition_type] = item;
    });
    
    res.status(200).json({
      success: true,
      user: {
        id: userId,
      },
      achievements: achievementsQuery.rows,
      progress: progressMap
    });
  } catch (e) {
    console.error('Error getting achievements:', e);
    res.status(500).json({
      success: false,
      message: 'Error getting achievements'
    });
  }
};


module.exports = {
  getAllAchievements,
  getAchievement,
  getUserAchievements
};