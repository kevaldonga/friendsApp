'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hashtagsOnPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.posts);
      this.belongsTo(models.hastags);
    }
  }
  hashtagsOnPost.init({
    postId: DataTypes.INTEGER,
    hashtagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hashtagsOnPost',
  });
  return hashtagsOnPost;
};