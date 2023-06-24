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
      // define association here
    }
  }
  chats.init({
    chatroomId: DataTypes.INTEGER,
    chat: DataTypes.STRING,
    sendStatus: DataTypes.INTEGER,
    sentFromProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chats',
  });
  return chats;
};