'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hashtags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.profiles, { through: "hashtagsonprofile", foreignKey: "profileId" });
      this.belongsToMany(models.stories, { through: "hashtagsonstory", foreignKey: "storyId" });
      this.belongsToMany(models.posts, { through: "hashtagsOnPost", foreignKey: "postId" });
    }
  }
  hashtags.init({
    tag: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    color: { type: DataTypes.STRING, allowNull: false },
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'hashtags',
  });
  return hashtags;
};