const request = require('supertest');
const express = require('express');

// Mock Database
const mockExecute = jest.fn();
// Mock Transaction methods
const mockBeginTransaction = jest.fn();
const mockCommit = jest.fn();
const mockRollback = jest.fn();
const mockRelease = jest.fn();

const mockConnection = {
    execute: mockExecute,
    beginTransaction: mockBeginTransaction,
    commit: mockCommit,
    rollback: mockRollback,
    release: mockRelease
};

const mockGetConnection = jest.fn().mockResolvedValue(mockConnection);

jest.mock('../config/db', () => ({
    execute: mockExecute,
    getConnection: mockGetConnection
}));

const authRoutes = require('../routes/auth');
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/check', () => {
        it('should return exists=true if user found', async () => {
            mockExecute.mockResolvedValue([[{ NickName: 'ExistingUser' }]]);

            const res = await request(app)
                .post('/api/auth/check')
                .send({ channelUserId: 'U123', registeredChannel: 'Line' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ exists: true, nickName: 'ExistingUser' });
        });

        it('should return exists=false if user not found', async () => {
            mockExecute.mockResolvedValue([[]]); // Empty rows

            const res = await request(app)
                .post('/api/auth/check')
                .send({ channelUserId: 'U999', registeredChannel: 'Line' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ exists: false });
        });

        it('should return 400 if fields missing', async () => {
            const res = await request(app).post('/api/auth/check').send({});
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/register', () => {
        const newUser = {
            nickName: 'NewUser',
            firstName: 'First',
            lastName: 'Last',
            mobile: '0812345678',
            email: 'test@example.com',
            channelUserId: 'U123',
            registeredChannel: 'Line'
        };

        it('should register new user successfully', async () => {
            // Mock Insert Result
            // execute returns [result, fields]
            // Insert result Mock
            mockConnection.execute.mockResolvedValueOnce([{ insertId: 5 }]); // INSERT
            mockConnection.execute.mockResolvedValueOnce([{ affectedRows: 1 }]); // UPDATE

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('memberId', 'M00000005');

            // Verify Transaction flow
            expect(mockBeginTransaction).toHaveBeenCalled();
            expect(mockCommit).toHaveBeenCalled();
            expect(mockRelease).toHaveBeenCalled();
        });

        it('should return 409 if user already registered (Duplicate)', async () => {
            const error = new Error('Duplicate entry');
            error.code = 'ER_DUP_ENTRY';
            mockConnection.execute.mockRejectedValueOnce(error);

            const res = await request(app)
                .post('/api/auth/register')
                .send(newUser);

            expect(res.statusCode).toEqual(409);
            expect(mockRollback).toHaveBeenCalled();
            expect(mockRelease).toHaveBeenCalled();
        });
    });
});
