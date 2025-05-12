const Post = require('../models/post.model');
const PostLike = require('../models/postLike.model');

// Like a post
exports.likePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked/disliked the post
    const existingLike = await PostLike.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      if (existingLike.type === 'like') {
        return res.status(400).json({ message: 'Already liked this post' });
      }
      // Update from dislike to like
      existingLike.type = 'like';
      await existingLike.save();
      return res.json({ message: 'Like updated successfully' });
    }

    // Create new like
    await PostLike.create({
      userId,
      postId,
      type: 'like'
    });

    res.json({ message: 'Liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked/disliked the post
    const existingLike = await PostLike.findOne({
      where: { userId, postId }
    });

    if (existingLike) {
      if (existingLike.type === 'dislike') {
        return res.status(400).json({ message: 'Already disliked this post' });
      }
      // Update from like to dislike
      existingLike.type = 'dislike';
      await existingLike.save();
      return res.json({ message: 'Dislike updated successfully' });
    }

    // Create new dislike
    await PostLike.create({
      userId,
      postId,
      type: 'dislike'
    });

    res.json({ message: 'Disliked successfully' });
  } catch (error) {
    console.error('Dislike post error:', error);
    res.status(500).json({ message: 'Error disliking post' });
  }
};

// Get like/dislike counts for a post
exports.getLikeCounts = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get counts
    const likes = await PostLike.count({
      where: { postId, type: 'like' }
    });

    const dislikes = await PostLike.count({
      where: { postId, type: 'dislike' }
    });

    res.json({ likes, dislikes });
  } catch (error) {
    console.error('Get like counts error:', error);
    res.status(500).json({ message: 'Error fetching like counts' });
  }
};