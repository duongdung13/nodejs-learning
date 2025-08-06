import express from 'express';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET posts with author populated
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author');
  res.json(posts);
});

// POST with transaction
router.post('/create-with-user', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create([{ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }], { session });
    const post = await Post.create([{ title: 'Post by John', author: user[0]._id }], { session });

    await session.commitTransaction();
    res.json({ user: user[0], post: post[0] });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
});

// Aggregation example
router.get('/stats', async (req, res) => {
  const stats = await Post.aggregate([
    { $group: { _id: '$author', totalPosts: { $sum: 1 } } }
  ]);

  res.json(stats);
});

export default router;
