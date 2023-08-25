"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.profiles, {
        as: "profiles",
        sourceKey: "id",
        foreignKey: "userId",
      });
    }
  }
  users.init(
    {
      uid: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [10, 100] },
      },
      phoneno: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [10, 15] },
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { len: [3, 7] },
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM("user", "admin", "moderator"),
        allowNull: false,
        defaultValue: "user",
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "users",
    },
  );
  return users;
};
