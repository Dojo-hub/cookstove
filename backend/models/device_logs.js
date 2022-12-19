"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Device_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device_logs.belongsTo(models.Device, {
        foreignKey: "deviceSerialNumber",
        targetKey: "serialNumber",
        onDelete: "CASCADE",
      });
    }
  }
  Device_logs.init(
    {
      timestamp: DataTypes.DATE,
      load: DataTypes.DECIMAL,
      temperature: DataTypes.DECIMAL,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Device_logs",
    }
  );
  return Device_logs;
};
