require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // Create Database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} check/creation successful.`);

        // Use Database
        await connection.changeUser({ database: process.env.DB_NAME });

        // Read Schema File
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute Schema
        await connection.query(schemaSql);
        console.log('Schema executed successfully.');

        await connection.end();
    } catch (err) {
        console.error('Initialization failed:', err);
    }
}

initDb();
