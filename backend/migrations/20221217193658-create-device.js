"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Devices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      userId: {
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
      serialNumber: {
        type: Sequelize.STRING,
        unique: true,
      },
      number: {
        type: Sequelize.STRING,
      },
      simID: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Devices");
  },
};
