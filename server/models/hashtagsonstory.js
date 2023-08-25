"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hashtagsOnStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.stories);
      this.belongsTo(models.hashtags);
    }
  }
  hashtagsOnStory.init(
    {
      storyId: { type: DataTypes.INTEGER, allowNull: false },
      hashtagId: { type: DataTypes.INTEGER, allowNull: false },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "hashtagsOnStory",
    },
  );
  return hashtagsOnStory;
};
