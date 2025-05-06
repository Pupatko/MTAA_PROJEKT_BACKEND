const pool = require('../config/db');

// List of friends for the logged-in user
const getFriends = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.xp, u.created_at
       FROM users u
       JOIN friends f ON u.id = f.friend_id
       WHERE f.user_id = $1
       ORDER BY u.name ASC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error getting friends:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving friends'
    });
  }
};


const addFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.userId;

  // Contorl that the user does not try to add himself
  if (userId === friendId) {
    return res.status(400).json({
      success: false,
      message: 'You cannot add yourself'
    });
  }

  try {
    // Check if the user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [friendId]
    );

    if (userExists.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // User already has this friend
    const alreadyFriends = await pool.query(
      'SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2',
      [userId, friendId]
    );

    if (alreadyFriends.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'Already exist'
      });
    }

    // Adding a friend
    // ??? 
    await pool.query(
        'INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)',
        [userId, friendId]
    );

    return res.status(201).json({
      success: true,
      message: 'Friend added successfully'
    });
  } catch (err) {
    console.error('Error adding friend:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error while adding friend'
    });
  }
};


const removeFriend = async (req, res) => {
  const userId = req.user.id;
  const friendId = req.params.userId;

  try {
    // Check if the user exists
    const friendship = await pool.query(
      'SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2',
      [userId, friendId]
    );

    if (friendship.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found'
      });
    }

    // Delete the friend from the user's friend list
    // ???
    await pool.query(
        'DELETE FROM friends WHERE user_id = $1 AND friend_id = $2',
        [userId, friendId]
    );

    return res.status(200).json({
      success: true,
      message: 'Friend removed successfully'
    });
  } catch (err) {
    console.error('Error removing friend:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error while removing friend'
    });
  }
};


const searchUsers = async (req, res) => {
  const userId = req.user.id;
  const searchName = req.query.name;

  if (!searchName || searchName.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Search name is required'
    });
  }

  try {
    // Search for users by name, select first 20 finding results and order them by name
    const result = await pool.query(
      `SELECT u.id, u.name, u.xp,
        CASE WHEN f.friend_id IS NOT NULL THEN true ELSE false END AS is_friend
       FROM users u
       LEFT JOIN friends f ON u.id = f.friend_id AND f.user_id = $1
       WHERE u.id != $1 AND u.name ILIKE $2
       ORDER BY u.name ASC
       LIMIT 20`,
      [userId, `%${searchName}%`]
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error('Error searching users:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error while searching users'
    });
  }
};

module.exports = {
  getFriends,
  addFriend,
  removeFriend,
  searchUsers
};