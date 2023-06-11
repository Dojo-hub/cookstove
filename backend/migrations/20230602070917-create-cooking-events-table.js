"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // create transaction
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Cooking_Events",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          deviceId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "Devices",
              key: "id",
            },
          },
          startDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          endDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          duration: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0.0,
          },
          averageTemperature: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0,
          },
          maximumTemperature: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0,
          },
          totalFuelMass: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0,
          },
          foodMass: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0.0,
          },
          energyConsumption: {
            type: Sequelize.DECIMAL(10, 4),
          },
          power: {
            type: Sequelize.DECIMAL(10, 4),
          },
          usefulEnergy: {
            type: Sequelize.DECIMAL(10, 4),
          },
          usefulThermalPower: {
            type: Sequelize.DECIMAL(10, 4),
          },
          energySavings: {
            type: Sequelize.DECIMAL(10, 4),
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        },
        { transaction }
      );
      // create constraints
      await queryInterface.addConstraint("Cooking_Events", {
        fields: ["deviceId"],
        type: "foreign key",
        name: "fk_cooking_events_deviceId",
        references: {
          table: "Devices",
          field: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
        transaction,
      });
      // commit transaction
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        "Cooking_Events",
        "fk_cooking_events_deviceId",
        { transaction }
      );
      await queryInterface.dropTable("Cooking_Events", { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
