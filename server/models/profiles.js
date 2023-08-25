"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users);
    }
  }
  profiles.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [5, 30] },
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [20, 255] },
      },
      isActive: { type: DataTypes.BOOLEAN, allowNull: true },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [5, 20] },
      },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      followers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      followings: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      profileImg: { type: DataTypes.STRING, allowNull: true },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "profiles",
    },
  );
  return profiles;
};
