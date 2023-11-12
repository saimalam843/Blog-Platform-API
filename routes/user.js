const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const BlogPost = require('../models/blogPost');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Follow a User
router.put('/follow/:userId', auth, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
      if (!targetUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const user = await User.findById(req.user.id);
      if (user.following.includes(req.params.userId)) {
        return res.status(400).json({ msg: 'Already following this user' });
      }
  
      user.following.push(req.params.userId);
      await user.save();
  
      // Create a notification for the followed user
      const newNotification = new Notification({
        user: req.params.userId,
        type: 'new follower',
        createdBy: req.user.id
      });
  
      await newNotification.save();
  
      res.json({ msg: 'User followed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Unfollow a User
router.put('/unfollow/:userId', auth, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
      if (!targetUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      const user = await User.findById(req.user.id);
      if (!user.following.includes(req.params.userId)) {
        return res.status(400).json({ msg: 'Not following this user' });
      }
  
      const removeIndex = user.following.indexOf(req.params.userId);
      user.following.splice(removeIndex, 1);
      await user.save();
  
      res.json({ msg: 'User unfollowed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Get User Feed (Posts by Users that the User follows - for User interaction module)
router.get('/feed', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('following');
      const followingUserIds = user.following.map(user => user._id);
  
      const posts = await BlogPost.find({ author: { $in: followingUserIds } })
        .populate('author', 'username')
        .sort({ createdAt: -1 });
  
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;