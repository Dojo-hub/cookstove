"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "Device_logs",
        "event",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.addConstraint("Device_logs", {
        fields: ["event"],
        type: "foreign key",
        name: "fk_device_logs_event",
        references: {
          table: "Cooking_Events",
          field: "id",
        },
        onUpdate: "cascade",
        onDelete: "set null",
        transaction,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Device_logs", "event");
  },
};
