const { getUserNotifications } = require('../../../controllers/notificationController');
const pool = require('../../../config/db');
const { testUser } = require('../../../tests/fixtures/users');

// Mock database connection
jest.mock('../../../config/db', () => ({ query: jest.fn() }));

describe('Notification Controller - getUserNotifications', () => {
  let req, res;
  
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
    req = { user: { id: testUser.id } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  
  // Helper function to setup tests
  const setupScenario = (type) => {
    if (type === 'with_notifications') {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: '1', message: 'Test notification' }],
        rowCount: 1
      });
    } else if (type === 'empty') {
      pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    } else if (type === 'error') {
      pool.query.mockRejectedValueOnce(new Error('DB error'));
      return jest.spyOn(console, 'error').mockImplementation();
    }
  };
  
  // Return 200 and notifications when found
  test('notifications when found', async () => {
    setupScenario('with_notifications');
    await getUserNotifications(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      data: expect.anything()
    }));
  });
  
  // Test for no notifications
  test('no notifications(404 returned)', async () => {
    setupScenario('empty');
    await getUserNotifications(req, res);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });
  
  // Test for database error
  test('database errors', async () => {
    const consoleSpy = setupScenario('error');
    await getUserNotifications(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});