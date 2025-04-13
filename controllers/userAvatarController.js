const pool = require('../config/db');
// File upload/download with middleware and filtering
const multer = require('multer');
// To create directory for user avatars and work with filesystem and directories
const fs = require('fs');
const path = require('path');

// Use multer library, soucres:
// https://www.npmjs.com/package/multer?activeTab=readme
// https://medium.com/@mohsinansari.dev/handling-file-uploads-and-file-validations-in-node-js-with-multer-a3716ec528a3
// https://devsarticles.com/multer-file-upload-nodejs-complete-guide

// File information
// Each file contains the following information:
/*
    fieldname
    originalname
    encoding
    mimetype
    size
    destination
    filename
    path
    buffer
*/ // Check package documentation: https://www.npmjs.com/package/multer?activeTab=readme

// Configure storage engine and filename
const storage = multer.diskStorage({
    // Set the destination for seving the file 
    destination: function (req, file, cb) {
        //  Create a path to directory for user files 
        const uploadDir = path.join(__dirname, '../uploads', req.user.id);
        
        // Create directory to save user avaters if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Callback to set the destination 
        // Parameters: 
        // 1. error - if error occurs, 
        //      then the destination is not set,
        // 2.   else the destination is set to the uploadDir
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // path.extname(file.originalname).toLowerCase() - get the file extension from the original file name
        // If not errors occurred, then set the filename:
        // Filename avatar + original file extension in lowercase
        cb(null, `avatar${path.extname(file.originalname).toLowerCase()}`);
    }
});   

// Check file type
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png/;

    // Test file extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // Test MIME type
    const mimetype = file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
};

// Initialize upload middleware and add file size limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter, // Filter files by extension
    limits: { fileSize: 1000000, files: 1, fields: 5, parts: 10 } // 1MB file size limit and 1 file limit, max 5 fields and 10 parts to prevent DoS attacks
}).single('avatar'); // 'avatar' is the name attribute of the file input field
// single('avatar') - single file upload, 'avatar' is the name of the field in the form, we can delete `files: 1` from limits
// .fields() - single file upload 
// .array() - multiple file upload
// .none() - no file upload, only fields
// In Postman body => form-data, key = avatar, file type, value = uploaded_file.jpg/png

// File upload route
const uploadAvatar = async (req, res) => {
    upload(req, res, async (err) => {
        try {
            // Check for errors during file upload(fileFilter, file size)
            // And return new Error('Invalid file type. Only JPEG and PNG are allowed.');
            // If error occurs
            if (err) {
                return res.status(400).send({ message: err.message });
            }

             // If request not contain file, return error
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Retrieve request parameters, current user ID and file path
            const userId = req.user.id;
            // Path to saved file in the filesystem
            const filePath = req.file.path; // Set by multer middleware(from storage engine block)
            

            // Check existence of the user avatar
            const existingAvatar = await pool.query(
                'SELECT * FROM user_files WHERE user_id = $1 AND file_type = $2',
                [userId, 'avatar']
            );

            // Check if the user already has an avatar, update avatar 
            if (existingAvatar.rowCount > 0) {
                await pool.query(
                    'UPDATE user_files SET file_path = $1 WHERE user_id = $2 AND file_type = $3',
                    [filePath, userId, 'avatar']
                );
            } else { // If not, insert new avatar
                await pool.query(
                    'INSERT INTO user_files (user_id, file_type, file_path) VALUES ($1, $2, $3)',
                    [userId, 'avatar', filePath]
                );
            }

            return res.status(200).json({
                success: true,
                message: 'Avatar uploaded successfully'
            });
        } catch {
            return res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    });
};

// Download avatar route
const downloadAvatar = async (req, res) => {
    try {
        // Get user ID from request parameters or from the authenticated user token
        const userId = req.params.userID || req.user.id;
        
        // Try to get path to the avatar from the database
        const result = await pool.query(
            'SELECT file_path FROM user_files WHERE user_id = $1 AND file_type = $2',
            [userId, 'avatar']
        );

        // User doesn't have an avatar
        // Return not found error to the client, clien can set default avatar
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Avatar not found'
            });
        }

        // Extract file path from the user file record 
        const filePath = result.rows[0].file_path;

        // If path doesn't exist, return not found error
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Avatar file not found'
            });
        }

        // Else return user avatar
        res.sendFile(path.resolve(filePath));
    } catch {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete user avatar
const deleteAvatar = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user awatar path
        const result = await pool.query(
            'SELECT file_path FROM user_files WHERE user_id = $1 AND file_type = $2',
            [userId, 'avatar']
        );

        // Avatar not found in the database
        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Avatar not found'
            });
        }

        await pool.query(
            'DELETE FROM user_files WHERE user_id = $1 AND file_type = $2',
            [userId, 'avatar']
        );

        // Delete file in the filesystem if it exists
        const filePath = result.rows[0].file_path;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return res.status(200).json({
            success: true,
            message: 'Avatar deleted successfully'
        });
    } catch {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    uploadAvatar,
    downloadAvatar,
    deleteAvatar
};