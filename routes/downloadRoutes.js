const express = require('express');
const { downloadBalanceSheet } = require('../controllers/download');

const router = express.Router();

// Get balance sheet for a specific user
router.get('/:id', downloadBalanceSheet);

module.exports = router;