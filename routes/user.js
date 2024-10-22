const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController'); // Adjust the path as needed

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

module.exports = router;

