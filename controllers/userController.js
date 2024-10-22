const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userExist = await User.findOne({ email });
  
  if (userExist) return res.status(400).json({ msg: 'User already exists' });
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, phone, password: hashedPassword });
  
  await newUser.save();
  return res.status(201).json({ msg: 'User registered' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: 'User does not exist' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({ token, userId: user._id });
};
