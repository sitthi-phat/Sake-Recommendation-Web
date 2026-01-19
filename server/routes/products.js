const express = require('express');
const router = express.Router();

// Mock Data
const DEFAULT_SAKE_LIST = [
    { id: 1, name: 'Dassai 23', type: 'Junmai Daiginjo', description: 'Fruity and elegant.', image: '/placeholder-sake.png', price: '$$$' },
    { id: 2, name: 'Kubota Manju', type: 'Junmai Daiginjo', description: 'Clean and crisp.', image: '/placeholder-sake.png', price: '$$$' },
    { id: 3, name: 'Hakkaisan', type: 'Tokubetsu Junmai', description: 'Dry and reliable.', image: '/placeholder-sake.png', price: '$$' },
];

const PERSONALIZED_SAKE_LIST = [
    { id: 101, name: 'Juyondai', type: 'Junmai Ginjo', description: 'Exclusive and aromatic, perfect for you.', image: '/placeholder-sake.png', price: '$$$$' },
    { id: 102, name: 'Hiroki', type: 'Junmai', description: 'Rich heavy umami that matches your taste.', image: '/placeholder-sake.png', price: '$$$' },
    { id: 1, name: 'Dassai 23', type: 'Junmai Daiginjo', description: 'A classic choice you usually like.', image: '/placeholder-sake.png', price: '$$$' },
];

router.get('/', (req, res) => {
    const { customerId, guest } = req.query;

    console.log('GET /products', req.query);

    if (customerId) {
        // Simulate personalized logic
        return res.json({
            mode: 'personalized',
            message: `Recommendations for Customer ID: ${customerId}`,
            products: PERSONALIZED_SAKE_LIST
        });
    }

    // Default / Guest mode
    return res.json({
        mode: 'guest',
        message: 'Top recommendations for everyone',
        products: DEFAULT_SAKE_LIST
    });
});

module.exports = router;
