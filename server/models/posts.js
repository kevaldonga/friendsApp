'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.profiles);
      this.belongsToMany(models.hashtags, { through: "hashtagsonpost", foreignKey: "hashtagsId" });

      this.hasMany(models.comments);
    }
  }
  posts.init({
    profileId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false, validate: { len: [10, 255] } },
    media: { type: DataTypes.STRING, allowNull: false },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    commentsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    uuid: { type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 }
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};