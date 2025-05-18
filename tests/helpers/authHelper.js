const jwt = require('jsonwebtoken');
const config = require('../../config');

function generateTestToken(user) {
  return jwt.sign({ id: user.id, name: user.name }, config.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateTestToken };