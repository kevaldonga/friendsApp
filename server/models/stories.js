'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.profiles);
      this.belongsToMany(models.hashtags, { through: "hashtagsOnStory", foreignKey: "hashtagId" });
    }
  }
  stories.init({
    profileId: { type: DataTypes.INTEGER, allowNull: false },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    media: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'stories',
  });
  return stories;
};