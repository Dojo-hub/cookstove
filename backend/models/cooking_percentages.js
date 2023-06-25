"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cooking_Percentages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cooking_Percentages.belongsTo(models.Device, {
        foreignKey: "deviceId",
        targetKey: "id",
        onDelete: "CASCADE",
      });
    }
  }
  Cooking_Percentages.init(
    {
      deviceId: DataTypes.INTEGER,
      fullLoad: DataTypes.DECIMAL,
      twoThirdsLoad: DataTypes.DECIMAL,
      halfLoad: DataTypes.DECIMAL,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Cooking_Percentages",
    }
  );
  return Cooking_Percentages;
};
