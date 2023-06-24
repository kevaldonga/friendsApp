'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRelationCount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userRelationCount.init({
    profileId: DataTypes.INTEGER,
    followers: DataTypes.INTEGER,
    followings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userRelationCount',
  });
  return userRelationCount;
};