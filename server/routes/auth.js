const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Check if user exists
router.post('/check', async (req, res) => {
    const { channelUserId, registeredChannel } = req.body;

    if (!channelUserId || !registeredChannel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT NickName FROM customer_master WHERE ChannelUserID = ? AND RegisteredChannel = ?',
            [channelUserId, registeredChannel]
        );

        if (rows.length > 0) {
            return res.json({ exists: true, nickName: rows[0].NickName });
        } else {
            return res.json({ exists: false });
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    const {
        nickName,
        firstName,
        lastName,
        mobile,
        email,
        channelUserId,
        registeredChannel
    } = req.body;

    if (!nickName || !channelUserId || !registeredChannel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Insert with placeholder MemberID
        const [result] = await connection.execute(
            `INSERT INTO customer_master 
            (MemberID, NickName, FirstName, LastName, Mobile, Email, ChannelUserID, RegisteredChannel) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            ['TEMP', nickName, firstName, lastName, mobile, email, channelUserId, registeredChannel]
        );

        const newId = result.insertId;
        const memberId = 'M' + String(newId).padStart(8, '0');

        // 2. Update with generated MemberID
        await connection.execute(
            'UPDATE customer_master SET MemberID = ? WHERE id = ?',
            [memberId, newId]
        );

        await connection.commit();
        return res.json({ success: true, memberId });
    } catch (err) {
        await connection.rollback();
        console.error('Registration error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User already registered' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
});

module.exports = router;
