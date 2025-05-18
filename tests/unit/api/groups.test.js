const { deleteGroup } = require('../../../controllers/groupController');
const pool = require('../../../config/db');
const { testAdmin } = require('../../../tests/fixtures/users');

jest.mock('../../../config/db', () => ({ query: jest.fn() }));

describe('Group Controller - deleteGroup', () => {
  let req, res, consoleSpy;
  
  beforeEach(() => {
    jest.clearAllMocks();
    req = { params: { id: '123' }, user: { id: testAdmin.id } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  
  afterEach(() => consoleSpy.mockRestore());
  
  test('delete group successfully', async () => {
    pool.query.mockImplementation(query => {
      if (query?.includes?.('DELETE')) return Promise.resolve({ rowCount: 1 });
      return Promise.resolve({ rowCount: 2 });
    });
    
    await deleteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  
  test('group does not exist(404 reeturned)', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });
    await deleteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
  
  test('database error', async () => {
    pool.query.mockImplementationOnce(() => Promise.resolve())
              .mockImplementationOnce(() => { throw new Error(); });
    
    await deleteGroup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});