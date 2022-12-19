"use strict";

const { Op, where } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
        userName: "jd",
        firstName: "John",
        lastName: "Doe",
        email: "jd@email.com",
        password: "password",
        isActive: true,
        isSuperUser: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
