const { generateWeeklyStats } = require('../../../services/weeklyStatsSerrvice');
const pool = require('../../../config/db');
const { sendNotification } = require('../../../sockets/notificationSocket');
const { testUser, testAdmin } = require('../../../tests/fixtures/users');

// Mock dependencies
jest.mock('../../../config/db', () => ({ connect: jest.fn() }));
jest.mock('../../../sockets/notificationSocket', () => ({ sendNotification: jest.fn() }));

describe('Weekly Stats Service', () => {
  let mockClient;
  
  // Setup mock
  beforeEach(() => {
    mockClient = { query: jest.fn(), release: jest.fn() };
    pool.connect.mockResolvedValue(mockClient);
    
    // Setup query responses
    mockClient.query.mockImplementation(query => {
      const data = {
        'RANK': { 
          rows: [
            { id: testAdmin.id, name: testAdmin.username, rank: 1 },
            { id: testUser.id, name: testUser.username, rank: 2 }
          ],
          rowCount: 2
        },
        'g.id': { 
          rows: [{ id: testUser.group_id, name: 'TopGroup', rank: 1 }],
          rowCount: 1
        },
        'group_id': { 
          rows: [
            { id: testUser.id, name: testUser.username, group_id: testUser.group_id },
            { id: testAdmin.id, name: testAdmin.username, group_id: testAdmin.group_id }
          ],
          rowCount: 2
        },
        'INSERT': { rows: [{ id: '1' }], rowCount: 1 }
      };
      
      for (const [key, value] of Object.entries(data)) {
        if (query.includes(key)) return Promise.resolve(value);
      }
      return Promise.resolve({ rows: [], rowCount: 0 });
    });
  });
  
  // Clean up
  afterEach(() => jest.clearAllMocks());
  
  // Combined test for weekly stats
  test('generate stats and send notifications successfully', async () => {
    const result = await generateWeeklyStats();// Execute
    
    // Verify database operations
    expect(pool.connect).toHaveBeenCalled();
    expect(mockClient.release).toHaveBeenCalled();
    
    // Verify notifications sent to both users
    expect(sendNotification).toHaveBeenCalledTimes(2);
    expect(sendNotification).toHaveBeenCalledWith(testUser.id, expect.anything());
    expect(sendNotification).toHaveBeenCalledWith(testAdmin.id, expect.anything());
    
    expect(result.success).toBe(true); // Verify result
  });
});