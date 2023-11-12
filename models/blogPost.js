const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    updatedAt: { type: Date, default: Date.now },

});

blogPostSchema.index({ title: 'text', content: 'text', category: 'text' });

module.exports = mongoose.model('blogPost', blogPostSchema);
