
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


const User = require('../models/User');
const BlogPost = require('../models/blogPost');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');


//all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password field (for security)
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//all blogposts
router.get('/blogposts', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find()
                                        .populate('author', 'username') // Only populate the username of the author
                                        .populate({
                                           path: 'rating',
                                           select: 'rating'
                                        });

        const postsWithAverageRating = blogPosts.map(post => {
            const averageRating = post.rating.reduce((acc, curr) => acc + curr.rating, 0) / post.rating.length;
            return {
                ...post._doc,
                averageRating: averageRating || 0 //When no ratings available 
            };
        });

        res.json(postsWithAverageRating);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

//by id
router.get('/blogposts/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findById(req.params.id)
                                       .populate('author', 'username')
                                       .populate('rating', 'rating')
                                       .populate('comments');

        if (!blogPost) {
            return res.status(404).send('Blog post not found');
        }

        res.json(blogPost);
    } catch (err) {
        res.status(500).send('Server error');
    }
});



module.exports = router;