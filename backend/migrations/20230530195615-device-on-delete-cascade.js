"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Device on delete cascade
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addConstraint("Cooking_Percentages", {
        fields: ["deviceId"],
        type: "foreign key",
        name: "cooking_percentages_deviceId_fkey",
        references: {
          table: "Devices",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "Cooking_Percentages",
        "cooking_percentages_deviceId_fkey",
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
