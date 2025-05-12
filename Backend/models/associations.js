const User = require('./user.model');
const UserFollower = require('./userFollower.model');
const Post = require('./post.model');

// User-UserFollower associations
User.hasMany(UserFollower, { 
  foreignKey: 'followerId',
  as: 'following'
});

User.hasMany(UserFollower, {
  foreignKey: 'followingId',
  as: 'followers'
});

UserFollower.belongsTo(User, {
  foreignKey: 'followerId',
  as: 'follower'
});

UserFollower.belongsTo(User, {
  foreignKey: 'followingId',
  as: 'following'
});

// Existing User-Post association
User.hasMany(Post, {
  foreignKey: 'userId',
  as: 'posts'
});

Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Post-PostLike associations
Post.hasMany(PostLike, {
  foreignKey: 'postId',
  as: 'likes'
});

User.hasMany(PostLike, {
  foreignKey: 'userId',
  as: 'postLikes'
});

PostLike.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

PostLike.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  UserFollower,
  Post
};