const { body, validationResult } = require('express-validator');

// Use express-validator to validate user input data
// https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
// https://dev.to/jayeshchoudhary/schema-based-validation-using-express-validator-in-nodejs-5ck0
// `.escape()` used to prevent XSS attacks by escaping HTML characters in the input data

// Send error response if validation fails
const validate = (message) => {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // 422 Unprocessable Entity
        return res.status(422).json({ 
          success: false, 
          message: message
        });
      }
        // If no errors, move to the next middleware or route handler
      next();
    };
};
  

// Valdidate request fields for registration(name, password)
const validateRegistration = [
    body('name') // name validation
        .trim()
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be at least 3 characters and at most 32 characters')
        .matches(/^[a-zA-Z0-9_]*$/)
        .withMessage('Name must contain only letters, numbers and underscores')
        .escape(),
    body('password') // password validation
        .isLength({ min: 8})
        .withMessage('Password must be at least 8 characters'),

    validate('Invalid name or password')
];

// Validate new name for change name route
const validateChangeName = [
    body('newName')
        .trim()
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be at least 3 characters and at most 32 characters')
        .matches(/^[a-zA-Z0-9_]*$/)
        .withMessage('Name must contain only letters, numbers and underscores')
        .escape(),

    validate('Invalid name')
];

// Validate new password for change password route
const validateChangePassword = [
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
  
    validate('Invalid password')
];

// Validate group name and description for create group route
const validateGroupCreation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 32 })
        .withMessage('Group name must be at least 3 characters and at most 32 characters')
        .escape(),
    body('description')
        .trim()
        .isLength({ max: 512 })
        .withMessage('Group description must be at most 512 characters')
        .escape(),

    validate('Invalid group name or description')
];

// Validate new group name for change group name route
const validateChangeGroupName = [
    body('newName')
        .trim()
        .isLength({ min: 3, max: 32 })
        .withMessage('Group name must be at least 3 characters and at most 32 characters')
        .escape(),

    validate('Invalid group name')
];

// Validate new group description for change group description route
const validateChangeGroupDescription = [
    body('newDescription')
        .trim()
        .isLength({ max: 512 })
        .withMessage('Group description must be at most 512 characters')
        .escape(),

    validate('Invalid group description')
];


module.exports = {
    // User validation
    validateRegistration,
    validateChangeName,
    validateChangePassword, 

    // Group validation
    validateGroupCreation,
    validateChangeGroupName,
    validateChangeGroupDescription
};