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
      this.hasOne(models.profiles, { as: "profiles", foreignKey: "userId", sourceKey: "id" });
    }
  }
  users.init({
    uid: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 100] } },
    phoneno: { type: DataTypes.STRING, allowNull: true, validate: { len: [10, 15] } },
    countryCode: { type: DataTypes.STRING, allowNull: true, validate: { len: [3, 7] } }
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};