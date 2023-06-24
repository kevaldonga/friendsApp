'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likesOnComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.profiles);
      this.belongsTo(models.comments);
    }
  }
  likesOnComment.init({
    profileId: { type: DataTypes.INTEGER, allowNull: false },
    commentId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'likesOnComment',
  });
  return likesOnComment;
};