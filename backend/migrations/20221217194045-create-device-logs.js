"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Device_logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      load: {
        type: Sequelize.STRING,
      },
      temperature: {
        type: Sequelize.DECIMAL,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      deviceSerialNumber: {
        onDelete: "CASCADE",
        type: Sequelize.STRING,
        references: {
          model: "Devices",
          key: "serialNumber",
          as: "deviceSerialNumber",
        },
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
    await queryInterface.dropTable("Device_logs");
  },
};
