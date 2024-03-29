"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class likesOnStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.profiles);
      this.belongsTo(models.stories);
    }
  }
  likesOnStory.init(
    {
      profileId: { type: DataTypes.INTEGER, allowNull: false },
      storyId: { type: DataTypes.INTEGER, allowNull: false },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "likesOnStory",
    },
  );
  return likesOnStory;
};
