require('dotenv').config();
const mongoose = require('mongoose');
console.log('MongoDB URI:', process.env.MONGODB_URI);

const express = require('express');

const authRoutes = require('./routes/auth');
const blogPostRoutes = require('./routes/blogPosts');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/user');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');




const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT || 3003;


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
