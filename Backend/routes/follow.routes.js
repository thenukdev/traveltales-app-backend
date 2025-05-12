const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const { authenticateToken } = require('../middleware/auth');

// Follow/unfollow routes (requires authentication)
router.post('/follow/:userId', authenticateToken, followController.followUser);
router.delete('/follow/:userId', authenticateToken, followController.unfollowUser);

// Follower/following list routes (public)
router.get('/users/:id/followers', followController.getFollowers);
router.get('/users/:id/following', followController.getFollowing);

// Feed route (requires authentication)
router.get('/feed', authenticateToken, followController.getFeed);

module.exports = router;