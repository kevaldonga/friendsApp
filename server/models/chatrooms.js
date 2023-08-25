"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chatrooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.profiles, { foreignKey: "profileId1" });
      this.belongsTo(models.profiles, { foreignKey: "profileId2" });

      this.hasMany(models.chats);
    }
  }
  chatrooms.init(
    {
      profileId1: { type: DataTypes.INTEGER, allowNull: false },
      profileId2: { type: DataTypes.INTEGER, allowNull: false },
      background: { type: DataTypes.STRING, allowNull: false },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: "chatrooms",
    },
  );
  return chatrooms;
};
