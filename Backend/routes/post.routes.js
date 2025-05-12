const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const jwt = require('jsonwebtoken');

// Authentication middleware
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);

// Protected routes
router.post('/posts', authenticateToken, postController.createPost);
router.put('/posts/:id', authenticateToken, postController.updatePost);
router.delete('/posts/:id', authenticateToken, postController.deletePost);

module.exports = router;