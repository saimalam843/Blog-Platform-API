const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Notification = require('../models/Notification');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get Notifications for User
router.get('/', auth, async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.id })
        .populate('createdBy', 'username')
        .populate('post', 'title')
        .sort({ createdAt: -1 });
  
      res.json(notifications);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

  module.exports = router;