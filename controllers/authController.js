const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateTokens');

const refreshToken = (request, response) => {
    const token = request.cookies.refreshToken;

    if (!token) {
        return response.status(401).json({
        success: false,
        message: 'Missing refresh token',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        // ukladat refresh token do DB ? asi nie xd , to len random myslienka
        const { accessToken, refreshToken } = generateTokens(decoded.id);

        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 20 * 60 * 1000,
        });

        return response.json({
            success: true,
            accessToken
        });
        
    } catch (err) {
        return response.status(403).json({
        success: false,
        message: 'Invalid refresh token',
        });
    }
};

module.exports = { refreshToken };
