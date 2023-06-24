'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRelation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  userRelation.init({
    followerProfileId: DataTypes.INTEGER,
    beingFollowedProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userRelation',
  });
  return userRelation;
};