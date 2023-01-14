"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint("Devices", "Devices_ibfk_1", {
        transaction: t,
      });
      await queryInterface.addConstraint("Devices", {
        fields: ["userId"],
        type: "foreign key",
        name: "userid_null_ondelete",
        onDelete: "SET NULL",
        references: {
          table: "Users",
          field: "id",
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint("Devices", "userid_null_ondelete", {
        transaction: t,
      });
      await queryInterface.addConstraint("Devices", {
        fields: ["userId"],
        type: "foreign key",
        onDelete: "CASCADE",
        references: {
          table: "Users",
          field: "id",
        },
        transaction: t,
      });
    });
  },
};
