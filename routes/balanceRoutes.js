const express = require('express');
const { getBalanceForUser } = require('../controllers/balanceController');

const router = express.Router();

// Get balance sheet for a specific user
router.get('/:id', getBalanceForUser);

module.exports = router;
