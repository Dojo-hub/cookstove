"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // rename created_at to createdAt
      await queryInterface.renameColumn(
        "Cooking_Events",
        "created_at",
        "createdAt",
        { transaction }
      );
      // rename updated_at to updatedAt
      await queryInterface.renameColumn(
        "Cooking_Events",
        "updated_at",
        "updatedAt",
        { transaction }
      );
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // rename createdAt to created_at
      await queryInterface.renameColumn(
        "Cooking_Events",
        "createdAt",
        "created_at",
        { transaction }
      );
      // rename updatedAt to updated_at
      await queryInterface.renameColumn(
        "Cooking_Events",
        "updatedAt",
        "updated_at",
        { transaction }
      );
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
