"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "Devices",
        "country",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "region",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "stoveEfficiency",
        {
          type: Sequelize.INTEGER,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "maximumCookingLoad",
        {
          type: Sequelize.DECIMAL(10, 2),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "longitude",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "latitude",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "altitude",
        {
          type: Sequelize.DECIMAL(10, 2),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "cookingCapacity",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "baselineEfficiency",
        {
          type: Sequelize.INTEGER,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "build",
        {
          type: Sequelize.ENUM("Mobile", "Fixed"),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "saucepanType",
        {
          type: Sequelize.ENUM("Aluminium", "Stainless Steel"),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "fuel",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "siteType",
        {
          type: Sequelize.STRING,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "fuelMoistureContent",
        {
          type: Sequelize.DECIMAL(10, 2),
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Devices",
        "fuelCaloricValue",
        {
          type: Sequelize.DECIMAL(10, 2),
        },
        { transaction }
      );
      // create table Cooking_Percentages
      await queryInterface.createTable(
        "Cooking_Percentages",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          deviceId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Devices",
              key: "id",
            },
            allowNull: false,
          },
          month: { type: Sequelize.STRING, allowNull: false },
          fullLoad: { type: Sequelize.DECIMAL, allowNull: false },
          twoThirdsLoad: { type: Sequelize.DECIMAL, allowNull: false },
          halfLoad: { type: Sequelize.DECIMAL, allowNull: false },
          startDate: { type: Sequelize.DATE, allowNull: false },
          endDate: { type: Sequelize.DATE, allowNull: false },
          createdAt: { type: Sequelize.DATE, allowNull: false },
          updatedAt: { type: Sequelize.DATE, allowNull: false },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // remove columns
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("Devices", "country", { transaction });
      await queryInterface.removeColumn("Devices", "region", { transaction });
      await queryInterface.removeColumn("Devices", "stoveEfficiency", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "maximumCookingLoad", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "longitude", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "latitude", { transaction });
      await queryInterface.removeColumn("Devices", "altitude", { transaction });
      await queryInterface.removeColumn("Devices", "cookingCapacity", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "baselineEfficiency", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "build", { transaction });
      await queryInterface.removeColumn("Devices", "saucepanType", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "fuel", { transaction });
      await queryInterface.removeColumn("Devices", "siteType", { transaction });
      await queryInterface.removeColumn("Devices", "fuelMoistureContent", {
        transaction,
      });
      await queryInterface.removeColumn("Devices", "fuelCaloricValue", {
        transaction,
      });
      // drop table Cooking_Percentages
      await queryInterface.dropTable("Cooking_Percentages", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
