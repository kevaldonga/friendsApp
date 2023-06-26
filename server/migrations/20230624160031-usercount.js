'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // followers
    queryInterface.addColumn("profiles", "followers", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    // followings
    queryInterface.addColumn("profiles", "followings", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    // followers
    queryInterface.removeColumn("profiles", "followers");
    // followings
    queryInterface.removeColumn("profiles", "followings");

  }
};
