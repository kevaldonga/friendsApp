'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init({
    uid: DataTypes.STRING,
    profileId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    phoneno: DataTypes.STRING,
    countryCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};