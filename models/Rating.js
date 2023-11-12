const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    blogPost: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true }
});

module.exports = mongoose.model('Rating', ratingSchema);
