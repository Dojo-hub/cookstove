"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Cooking_Percentages", "month");
    await queryInterface.removeColumn("Cooking_Percentages", "endDate");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Cooking_Percentages", "month", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "January",
    });
    await queryInterface.addColumn("Cooking_Percentages", "endDate", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });
  },
};
