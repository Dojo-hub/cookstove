"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cooking_Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cooking_Events.belongsTo(models.Device, {
        foreignKey: "deviceId",
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  Cooking_Events.init(
    {
      deviceId: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      duration: DataTypes.INTEGER,
      averageTemperature: DataTypes.DECIMAL,
      maximumTemperature: DataTypes.DECIMAL,
      totalFuelMass: DataTypes.DECIMAL,
      foodMass: DataTypes.DECIMAL,
      energyConsumption: DataTypes.DECIMAL,
      power: DataTypes.DECIMAL,
      usefulEnergy: DataTypes.DECIMAL,
      usefulThermalPower: DataTypes.DECIMAL,
      energySavings: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Cooking_Events",
    }
  );
  return Cooking_Events;
};
