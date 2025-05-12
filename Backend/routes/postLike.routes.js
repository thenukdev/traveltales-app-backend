const express = require('express');
const router = express.Router();
const postLikeController = require('../controllers/postLike.controller');
const jwt = require('jsonwebtoken');

// Authentication middleware
const { authenticateToken } = require('../middleware/auth');

// Like/Dislike routes
router.post('/posts/:id/like', authenticateToken, postLikeController.likePost);
router.post('/posts/:id/dislike', authenticateToken, postLikeController.dislikePost);
router.get('/posts/:id/likes', postLikeController.getLikeCounts);

module.exports = router;