const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Middleware
const verifyApiSecret = require('./middleware/security');

// Routes
// Apply Security Middleware to all /api routes
app.use('/api', verifyApiSecret);

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.send('Sake Recommendation API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
