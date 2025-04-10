const pool = require('../config/db');
const { sendNotification } = require('../sockets/notificationSocket');

// Service function to update user achievement progress
// And discover new achievements for the user
async function updateUserProgress(userId, conditionType, increment = 1) {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Update user achievement progress 
    const updateResult = await client.query(
      `INSERT INTO user_achievement_progress (user_id, condition_type, current_value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, condition_type)
       DO UPDATE SET 
         current_value = user_achievement_progress.current_value + $3,
         last_updated = CURRENT_TIMESTAMP
       RETURNING current_value`,
      [userId, conditionType, increment]
    );
    
    const currentValue = updateResult.rows[0].current_value;
    
    // Contorl progress for unlocking new achievements
    const achievementsResult = await client.query(
      `SELECT a.* FROM achievements a
       LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
       WHERE a.condition_type = $2
         AND a.condition_value <= $3
         AND ua.user_id IS NULL
       ORDER BY a.condition_value`,
      [userId, conditionType, currentValue]
    );
    
    // New achievements unlocked
    if (achievementsResult.rows.length > 0) {
      for (const achievement of achievementsResult.rows) {
        // Insert user achievement to the database
        const insertResult = await client.query(
          `INSERT INTO user_achievements (user_id, achievement_id)
           VALUES ($1, $2)
           RETURNING achieved_at`,
          [userId, achievement.id]
        );
        
        const achievedAt = insertResult.rows[0].achieved_at;
        
        // Create a notification for the user about the new achievement
        const notificationResult = await client.query(
          `INSERT INTO notifications (user_id, message, is_read)
           VALUES ($1, $2, FALSE)
           RETURNING id, created_at`,
          [userId, `You earned the achievement: ${achievement.title}!`]
        );
        
        // Create the notification 
        const notification = {
          id: notificationResult.rows[0].id,
          message: `You earned the achievement: ${achievement.title}!`,
          created_at: notificationResult.rows[0].created_at,
          achieved_at: achievedAt, 
          type: 'achievement',
          achievement_title: achievement.title,
          achievement_description: achievement.description
        };
        
        // Send notification to the user
        try {
          sendNotification(userId, notification);
          console.log(`Achievement notification sent to user ${userId}: ${achievement.title}`);
        } catch (e) {
          console.error('Failed to send notification:', e);
        }
      }
    }
    
    // End the transaction
    await client.query('COMMIT');

    return { 
      success: true,
      currentValue 
    };
  } catch (e) {
    // Cancel the transaction in case of error and rollback
    await client.query('ROLLBACK');

    console.error('Error occurred to update user progress:', e);
    throw e;
  } finally {
    // Release the connection back to the pool
    client.release();
  }
}

// Function to initialize user progress 
const initializeUserProgress = async (userId) => {
  try {
    // Get all achievement
    const conditionTypes = await pool.query(
      'SELECT DISTINCT condition_type FROM achievements'
    );
     
    for (const row of conditionTypes.rows) {
      const conditionType = row.condition_type;
      
      // Add every achievement type to the user achievements with progress 0
      await pool.query(`
        INSERT INTO user_achievement_progress (user_id, condition_type, current_value)
        VALUES ($1, $2, 0)
        ON CONFLICT (user_id, condition_type) DO NOTHING
      `, [userId, conditionType]);
    }
    
    return { 
      success: true,
      message: 'User progress initialized'
    };
  } catch (e) {
    console.error('Error to initialize user progress:', e);
    throw e;
  }
};

module.exports = {
  updateUserProgress,
  initializeUserProgress
};