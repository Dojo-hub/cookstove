"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Device_logs", [
      {
        timestamp: new Date(),
        load: 43,
        temperature: 20.4,
        longitude: "283",
        latitude: "120",
        DeviceSerialNumber: "12N$BFSBYBE83",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Device_logs", null, {});
  },
};
