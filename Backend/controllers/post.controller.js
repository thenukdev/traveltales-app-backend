const Post = require('../models/post.model');
const User = require('../models/user.model');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, country, visit_date } = req.body;
    const post = await Post.create({
      title,
      content,
      country,
      visit_date,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

// Get all posts with pagination, filtering and sorting
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { country, username, sort } = req.query;

    // Build where clause for filtering
    const whereClause = {};
    const includeClause = [{ model: User, as: 'user', attributes: ['username'] }];

    if (country) {
      whereClause.country = country;
    }

    if (username) {
      includeClause[0].where = { username };
    }

    // Determine sort order
    let order = [['createdAt', 'DESC']];
    if (sort) {
      switch (sort) {
        case 'newest':
          order = [['createdAt', 'DESC']];
          break;
        case 'oldest':
          order = [['createdAt', 'ASC']];
          break;
        // Note: For most_liked and most_commented, you'll need to implement these
        // features first and add the corresponding fields to the Post model
      }
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit,
      offset,
      order
    });

    res.json({
      posts,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['username'] }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, country, visit_date } = req.body;
    await post.update({
      title,
      content,
      country,
      visit_date
    });

    res.json({
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};