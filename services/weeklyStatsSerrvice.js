const pool = require('../config/db');
const { sendNotification } = require('../sockets/notificationSocket');

const TEST_MODE = 1;

async function generateWeeklyStats() {
  const client = await pool.connect();
  
  try {
    console.log('Starting weekly stats generation...');
    
    // Get top users
    const topUsersQuery = await client.query(`
      SELECT id, name, xp, RANK() OVER (ORDER BY xp DESC) as rank 
      FROM users 
      ORDER BY xp DESC 
      LIMIT 5
    `);
    
    // Get top groups
    const topGroupsQuery = await client.query(`
      SELECT g.id, g.name, 
             COALESCE(SUM(u.xp), 0) as xp,
             RANK() OVER (ORDER BY COALESCE(SUM(u.xp), 0) DESC) as rank
      FROM groups g
      LEFT JOIN users u ON g.id = u.group_id
      GROUP BY g.id
      ORDER BY xp DESC
      LIMIT 5
    `);
    
    // Get all users
    const allUsersQuery = await client.query(`
      SELECT id, name, xp, group_id,
      RANK() OVER (ORDER BY xp DESC) as user_rank
      FROM users
    `);
    
    // Log statistics
    console.log(`Generated stats for ${allUsersQuery.rowCount} users`);
    console.log(`Top user: ${topUsersQuery.rows[0]?.name || 'none'} with ${topUsersQuery.rows[0]?.xp || 0} XP`);
    console.log(`Top group: ${topGroupsQuery.rows[0]?.name || 'none'} with ${topGroupsQuery.rows[0]?.xp || 0} XP`);
    
    // Send notifications to all users
    for (const user of allUsersQuery.rows) {
      let message = `📊 Weekly Stats Update:\n\n`;
      
      message += `👑 Top Users:\n`;
      topUsersQuery.rows.slice(0, 3).forEach((topUser, index) => {
          message += `${index + 1}. ${topUser.name} - ${topUser.xp} XP\n`;
      });
    
      message += `\n🏆 Top Groups:\n`;
      topGroupsQuery.rows.slice(0, 3).forEach((topGroup, index) => {
          message += `${index + 1}. ${topGroup.name} - ${topGroup.xp} XP\n`;
      });
      
      // user's own rank
      message += `\n🏆 Your rank: #${user.user_rank} with ${user.xp} XP\n\n`;
      
      if (user.group_id) {
        try {
          const groupQuery = await client.query(`
            SELECT g.name, 
                   COALESCE(SUM(u.xp), 0) as xp,
                   (SELECT COUNT(*) + 1 FROM 
                     (SELECT COALESCE(SUM(u.xp), 0) as total_xp
                      FROM groups g2
                      LEFT JOIN users u ON g2.id = u.group_id
                      GROUP BY g2.id
                      HAVING COALESCE(SUM(u.xp), 0) > (
                          SELECT COALESCE(SUM(u.xp), 0)
                          FROM users u
                          WHERE u.group_id = $1
                      )) as better_groups
                   ) as group_rank
            FROM groups g
            LEFT JOIN users u ON g.id = u.group_id
            WHERE g.id = $1
            GROUP BY g.id, g.name
          `, [user.group_id]);
          
          if (groupQuery.rows.length > 0) {
            const groupInfo = groupQuery.rows[0];
            message += `👥 Your group "${groupInfo.name}" is ranked #${groupInfo.group_rank} with ${groupInfo.xp} XP\n`;
            message += `   (combined XP of all members)\n`;
          }
        } catch (groupErr) {
          console.error(`Error getting group info for user ${user.id}:`, groupErr);
        }
      }
      
      try {
        // Insert notification into database
        const notificationResult = await client.query(
          `INSERT INTO notifications (user_id, message, is_read)
           VALUES ($1, $2, FALSE)
           RETURNING id, created_at`,
          [user.id, message]
        );
        
        // Create notification
        const notification = {
          id: notificationResult.rows[0].id,
          message: message,
          created_at: notificationResult.rows[0].created_at
        };
        
        // Send notification via ws
        try {
          sendNotification(user.id, notification);
          if (TEST_MODE) {
            console.log(`Test mode: Notification sent to user ${user.id}: ${message}`);
          }
          console.log(`Notification sent to user ${user.id}`);
        } catch (socketErr) {
          console.error(`Failed to send notification to user ${user.id} via WebSocket:`, socketErr);
        }
      } catch (dbErr) {
        console.error(`Failed to save notification for user ${user.id}:`, dbErr);
      }
    }
    
    console.log('Weekly stats generation completed successfully');
    return { success: true, message: 'Weekly stats generated and sent to all users' };
    
  } catch (e) {
    console.error('Error generating weekly stats:', e);
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  generateWeeklyStats
};