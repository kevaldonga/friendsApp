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
      this.belongsTo(models.profiles);
    }
  }
  userRelationCount.init({
    profileId: { type: DataTypes.INTEGER, allowNull: false },
    followers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    followings: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  }, {
    sequelize,
    modelName: 'userRelationCount',
  });
  return userRelationCount;
};