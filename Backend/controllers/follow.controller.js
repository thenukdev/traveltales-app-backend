const User = require('../models/user.model');
const UserFollower = require('../models/userFollower.model');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    // Prevent self-following
    if (followerId === followingId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findByPk(followingId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    const existingFollow = await UserFollower.findOne({
      where: { followerId, followingId }
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Create follow relationship
    await UserFollower.create({ followerId, followingId });
    res.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ message: 'Error following user' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = parseInt(req.params.userId);

    const follow = await UserFollower.findOne({
      where: { followerId, followingId }
    });

    if (!follow) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    await follow.destroy();
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

// Get user's followers
exports.getFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const followers = await UserFollower.findAll({
      where: { followingId: userId },
      include: [{
        model: User,
        as: 'follower',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      followers: followers.map(f => f.follower)
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Error fetching followers' });
  }
};

// Get users being followed
exports.getFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const following = await UserFollower.findAll({
      where: { followerId: userId },
      include: [{
        model: User,
        as: 'following',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      following: following.map(f => f.following)
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Error fetching following users' });
  }
};

// Get feed of posts from followed users
exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get IDs of users being followed
    const followedUsers = await UserFollower.findAll({
      where: { followerId: req.user.id },
      attributes: ['followingId']
    });

    const followedUserIds = followedUsers.map(f => f.followingId);

    // Get posts from followed users
    const { count, rows: posts } = await Post.findAndCountAll({
      where: {
        userId: followedUserIds
      },
      include: [{ 
        model: User,
        as: 'user',
        attributes: ['username']
      }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      posts,
      total: count,
      page,
      limit
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Error fetching feed' });
  }
};