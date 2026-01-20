require('dotenv').config();

const verifyApiSecret = (req, res, next) => {
    const apiSecret = req.headers['x-api-secret'];

    // Check if secret exists and matches .env
    if (!apiSecret || apiSecret !== process.env.API_SECRET) {
        console.warn(`[Security] Unauthorized access attempt from ${req.ip}`);
        return res.status(403).json({ error: 'Forbidden: Invalid or missing API Secret' });
    }

    next();
};

module.exports = verifyApiSecret;
