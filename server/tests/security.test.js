const request = require('supertest');
const express = require('express');
const verifyApiSecret = require('../middleware/security');

// Mock env
process.env.API_SECRET = 'TEST_SECRET_123';

const app = express();
app.use(express.json());
// Apply middleware to a test route
app.use('/api', verifyApiSecret);
app.get('/api/protected', (req, res) => {
    res.json({ message: 'Success' });
});

describe('Security Middleware', () => {
    it('should reject requests without x-api-secret header', async () => {
        const res = await request(app).get('/api/protected');
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Forbidden: Invalid or missing API Secret');
    });

    it('should reject requests with incorrect x-api-secret header', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('x-api-secret', 'WRONG_SECRET');
        expect(res.statusCode).toEqual(403);
    });

    it('should allow requests with correct x-api-secret header', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('x-api-secret', 'TEST_SECRET_123');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Success');
    });
});
