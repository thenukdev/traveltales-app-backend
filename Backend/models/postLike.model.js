const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostLike = sequelize.define('PostLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Posts',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('like', 'dislike'),
    allowNull: false
  }
});

// Define associations
PostLike.associate = (models) => {
  PostLike.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  PostLike.belongsTo(models.Post, {
    foreignKey: 'postId',
    as: 'post'
  });
};

module.exports = PostLike;