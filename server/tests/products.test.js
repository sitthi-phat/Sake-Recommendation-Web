const request = require('supertest');
const express = require('express');

// Mock Database
const mockExecute = jest.fn();
jest.mock('../config/db', () => ({
    execute: mockExecute
}));

const productRoutes = require('../routes/products');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('GET /api/products', () => {
    beforeEach(() => {
        mockExecute.mockClear();
    });

    it('should return default (guest) products when no query params provided', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mode', 'guest');
        expect(res.body.products).toHaveLength(3);
    });

    it('should return guest products when guest=true', async () => {
        const res = await request(app).get('/api/products?guest=true');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mode', 'guest');
        expect(res.body.message).toContain('Top recommendations');
    });

    it('should return personalized products with NickName when customerId is provided', async () => {
        // Mock DB response for NickName
        mockExecute.mockResolvedValue([[{ NickName: 'SakeMaster' }]]);

        const res = await request(app).get('/api/products?customerId=123');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mode', 'personalized');
        expect(res.body.message).toContain('Recommend For SakeMaster');
        expect(mockExecute).toHaveBeenCalledWith(
            expect.stringContaining('SELECT NickName'),
            ['123']
        );
    });

    it('should return personalized products with ID fallback if DB fails', async () => {
        // Mock DB failure
        mockExecute.mockRejectedValue(new Error('DB Error'));

        const res = await request(app).get('/api/products?customerId=123');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('mode', 'personalized');
        // Fallback message
        expect(res.body.message).toContain('Recommendations for Customer ID: 123');
    });
});
