"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device.hasMany(models.Device_logs, {
        foreignKey: "deviceSerialNumber",
        sourceKey: "serialNumber",
        as: "logs",
      });
      Device.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Device.hasMany(models.Cooking_Percentages, {
        foreignKey: "deviceId",
        sourceKey: "id",
        as: "monthlyCookingPercentages",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Device.init(
    {
      name: DataTypes.STRING,
      serialNumber: DataTypes.STRING,
      number: DataTypes.STRING,
      simID: DataTypes.STRING,
      imei: DataTypes.STRING,
      country: DataTypes.STRING,
      region: DataTypes.STRING,
      stoveEfficiency: DataTypes.DECIMAL,
      maximumCookingLoad: DataTypes.DECIMAL,
      longitude: DataTypes.DECIMAL,
      latitude: DataTypes.DECIMAL,
      altitude: DataTypes.DECIMAL,
      cookingCapacity: DataTypes.STRING,
      baselineEfficiency: DataTypes.DECIMAL,
      build: DataTypes.STRING,
      saucepanType: DataTypes.STRING,
      fuel: DataTypes.STRING,
      siteType: DataTypes.STRING,
      fuelMoistureContent: DataTypes.DECIMAL,
      fuelCaloricValue: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Device",
    }
  );
  return Device;
};
