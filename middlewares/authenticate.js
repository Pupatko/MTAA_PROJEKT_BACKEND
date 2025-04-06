const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // finta &&
    
    if (!token) {
        return res.status(401).send('Missing access token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Invalid or expired token');
    }
};

module.exports = authenticate;
