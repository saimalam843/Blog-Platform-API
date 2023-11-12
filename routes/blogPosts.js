const express = require('express');
const BlogPost = require('../models/blogPost');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const User = require('../models/User');

const auth = require('../middleware/auth');




const router = express.Router();

// Create Blog Post
router.post('/', auth, async (req, res) => {
    console.log(req.body);
    try {
    const { title, content, category} = req.body;
    let blogPost = new BlogPost({ title, content, author: req.user.id, category });
    await blogPost.save();
    res.status(201).json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Read Blog Posts with Pagination, Filtering and Sorting
router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 10, sortBy, order = 'asc', category, author } = req.query;
  
      let query = {};
      if (category) query.category = category;

      if (author) query['author.username'] = author; 
  
      let sort = {};
      if (sortBy) sort[sortBy] = order === 'asc' ? 1 : -1;
  
      const blogPosts = await BlogPost.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sort)
        .populate('author', 'username') // Adjusting according to User model
        .exec();
  
      res.json(blogPosts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// Update Blog Post (Only by Owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) return res.status(404).json({ msg: 'Blog post not found' });
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, { $set: { title, content } }, { new: true });
    res.json(blogPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete Blog Post (Only by Owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) return res.status(404).json({ msg: 'Blog post not found' });
    if (blogPost.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create Rating
router.post('/:id/rating', auth, async (req, res) => {
    try {
      const { rating } = req.body;
      const newRating = new Rating({ blogPost: req.params.id, author: req.user.id, rating });
      await newRating.save();
  

      res.status(201).json(newRating);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});
  
// Create Comment
router.post('/:id/comments', auth, async (req, res) => {
    try {
      const { comment } = req.body;
      const blogPost = await BlogPost.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ msg: 'Blog post not found' });
      }
  
      const newComment = new Comment({ blogPost: req.params.id, author: req.user.id, comment });
      await newComment.save();
  
      //Create notification for blog post's author
      const newNotification = new Notification({
        user: blogPost.author,
        type: 'new comment',
        createdBy: req.user.id,
        post: req.params.id
      });
  
      await newNotification.save();
  
      res.status(201).json(newComment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

module.exports = router;
