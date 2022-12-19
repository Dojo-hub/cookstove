'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Devices', [{
    name: "jd",
    serialNumber: "12N$BFSBYBE83",
    number: "048378274",
    simID: "42931038",
    UserId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }]
);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Devices', null, {});
  }
};
