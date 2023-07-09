'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.chatrooms);
      this.belongsTo(models.profiles, { foreignKey: "sentFromProfileId" });
    }
  }
  chats.init({
    chatroomId: { type: DataTypes.INTEGER, allowNull: false },
    chat: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 255] } },
    sendStatus: { type: DataTypes.INTEGER, allowNull: false, defaultValue: -1 },
    /* 
    * -1 - failed
    *  0 - sent
    *  1 - delievered
    *  2 - seen
    */
    sentFromProfileId: { type: DataTypes.INTEGER, allowNull: false },
    uuid: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 }
  }, {
    sequelize,
    modelName: 'chats',
  });
  return chats;
};