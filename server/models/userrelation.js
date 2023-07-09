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
      this.belongsTo(models.profiles, { foreignKey: "followerProfileId" });
      this.belongsTo(models.profiles, { foreignKey: "beingFollowedProfileId" });
    }
  }
  userRelation.init({
    followerProfileId: { type: DataTypes.INTEGER, allowNull: false },
    beingFollowedProfileId: { type: DataTypes.INTEGER, allowNull: false },
    uuid: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 }
  }, {
    sequelize,
    modelName: 'userRelation',
  });
  return userRelation;
};