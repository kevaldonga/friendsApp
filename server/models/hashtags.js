"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hashtags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.profiles, {
        through: "hashtagsonprofile",
        foreignKey: "profileId",
      });
      this.belongsToMany(models.stories, {
        through: "hashtagsonstory",
        foreignKey: "storyId",
      });
      this.belongsToMany(models.posts, {
        through: "hashtagsOnPost",
        foreignKey: "postId",
      });

      this.hasMany(models.hashtagModerators);
    }
  }
  hashtags.init(
    {
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [5, 50] },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [30, 255] },
      },
      color: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: false },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "hashtags",
    },
  );
  return hashtags;
};
