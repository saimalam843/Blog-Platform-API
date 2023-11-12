const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blogPost');

// Search for Blog Posts
router.get('/', async (req, res) => {
    try {
        const { keyword, category, author, sort, page, limit } = req.query;

        let query = {};
        if (keyword) {
            query.$text = { $search: keyword }; 
        }
        if (category) {
            query.category = category;
        }
        if (author) {
            query.author = author;
        }

        // Pagination
        const pageNumber = page ? parseInt(page) : 1;
        const pageSize = limit ? parseInt(limit) : 10;

        let blogPosts = BlogPost.find(query)
                                .skip((pageNumber - 1) * pageSize)
                                .limit(pageSize);

        // Sorting
        if (sort) {
            blogPosts = blogPosts.sort(sort);
        }

        const results = await blogPosts.exec();
        res.json(results);
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;