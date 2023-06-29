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
      this.belongsTo(models.users);
    }
  }
  profiles.init({
    username: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: true },
    note: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    followers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    followings: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'profiles',
  });
  return profiles;
};