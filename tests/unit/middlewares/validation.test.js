const { validateRegistration } = require('../../../middlewares/validation');
const { validationResult } = require('express-validator');

// Create a mock for the express-validator module
jest.mock('express-validator', () => ({
  body: jest.fn().mockReturnValue({
    trim: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    matches: jest.fn().mockReturnThis(),
    escape: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis()
  }),
  validationResult: jest.fn()
}));

describe('Validation Middleware', () => {
  test('validation fails(422 returned)', () => {
    // Setup
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    const next = jest.fn();
    
    validationResult.mockReturnValue({
      isEmpty: () => false
    });
    
    // Execute
    const validateFn = validateRegistration[validateRegistration.length - 1];
    validateFn(req, res, next);
    
    // Verify
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false
    }));
  });
});