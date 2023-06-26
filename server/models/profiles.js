'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profiles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  profiles.init({
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    note: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    followers: DataTypes.INTEGER,
    followings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profiles',
  });
  return profiles;
};