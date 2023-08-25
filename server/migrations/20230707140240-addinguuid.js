"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("chatrooms", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("chats", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("comments", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("hashtags", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("hashtagsOnPosts", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("hashtagsOnProfiles", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("hashtagsOnStories", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("likesOnPosts", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("likesOnComments", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("likesOnStories", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("posts", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("profiles", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("stories", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("users", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    queryInterface.addColumn("userRelations", "uuid", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("chatrooms", "uuid");
    queryInterface.removeColumn("chats", "uuid");
    queryInterface.removeColumn("comments", "uuid");
    queryInterface.removeColumn("hashtags", "uuid");
    queryInterface.removeColumn("hashtagsOnPosts", "uuid");
    queryInterface.removeColumn("hashtagsOnProfiles", "uuid");
    queryInterface.removeColumn("hashtagsOnStories", "uuid");
    queryInterface.removeColumn("likesOnPosts", "uuid");
    queryInterface.removeColumn("likesOnComments", "uuid");
    queryInterface.removeColumn("likesOnStories", "uuid");
    queryInterface.removeColumn("posts", "uuid");
    queryInterface.removeColumn("profiles", "uuid");
    queryInterface.removeColumn("stories", "uuid");
    queryInterface.removeColumn("users", "uuid");
    queryInterface.removeColumn("userRelations", "uuid");
  },
};
