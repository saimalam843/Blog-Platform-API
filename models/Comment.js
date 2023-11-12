const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blogPost: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);
