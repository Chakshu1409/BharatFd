const express = require('express');
const router = express.Router();
const {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ
} = require('../controllers/faqController');
// Basic CRUD Routes
router.post('/', createFAQ); // Create
router.get('/', getAllFAQs); // Read All

module.exports = router;
