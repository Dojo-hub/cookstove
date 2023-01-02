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
    }
  }
  Device.init(
    {
      name: DataTypes.STRING,
      serialNumber: DataTypes.STRING,
      number: DataTypes.STRING,
      simID: DataTypes.STRING,
      imei: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Device",
    }
  );
  return Device;
};
