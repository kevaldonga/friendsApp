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
      this.belongsToMany(models.hashtags, { through: "hashtagsonprofile", foreignKey: "hastagId" });
    }
  }
  profiles.init({
    username: { type: DataTypes.STRING, allowNull: false },
    bio: DataTypes.STRING,
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    note: DataTypes.STRING,
    userId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'profiles',
  });
  return profiles;
};