const { register, login } = require('../../../controllers/userController');
const pool = require('../../../config/db');
const bcryptjs = require('bcryptjs');

// Mocking the database connection, bcryptjs, generateTokens, and achievementService

jest.mock('../../../config/db', () => ({query: jest.fn()}));

jest.mock('../../../utils/generateTokens', () => jest.fn().mockReturnValue({
  accessToken: 'dummy-token',
  refreshToken: 'dummy-refresh'
}));

jest.mock('../../../services/achievementService', () => ({
  initializeUserProgress: jest.fn(),
  updateUserProgress: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn()
}));

describe('Auth Controller', () => {
  let req, res;

  // Before each test, create a new req body and res object
  beforeEach(() => {
    req = {
      body: {},
      user: { id: '1' },
      cookies: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks(); // Clear all mocks data before each test
  });

  // Test successful registration
  test('register a new user successfully', async () => {
    req.body = { name: 'newuser', password: 'pwd123' };
    // Mocking the database response
    pool.query.mockResolvedValueOnce({ rowCount: 0 });
    pool.query.mockResolvedValueOnce({
      rows: [{ id: '1', name: 'newuser' }],
      rowCount: 1
    });
    
    await register(req, res);// call the register function
    expect(res.status).toHaveBeenCalledWith(201);// compare the response
  });
  
  // Test login
  test('login user with valid credentials', async () => {
    req.body = { name: 'user', password: 'pwd123' };
    // Mocking the database response
    pool.query.mockResolvedValueOnce({
      rows: [{ id: '1', name: 'user', password: 'hash' }],
      rowCount: 1
    });
    // Mocking bcryptjs compare function
    bcryptjs.compare.mockResolvedValueOnce(true);
    // Executing the login function
    pool.query.mockResolvedValueOnce({
      rows: [{ id: '1', name: 'user' }],
      rowCount: 1
    });
    
    await login(req, res);// Call the login function
    expect(res.status).toHaveBeenCalledWith(200);// compare the response
  });
});