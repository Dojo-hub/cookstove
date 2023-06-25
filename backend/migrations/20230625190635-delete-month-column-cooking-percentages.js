"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Cooking_Percentages", "month");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Cooking_Percentages", "month", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
