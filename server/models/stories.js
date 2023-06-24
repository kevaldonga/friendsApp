'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stories.init({
    profileId: DataTypes.INTEGER,
    likesCount: DataTypes.INTEGER,
    media: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'stories',
  });
  return stories;
};