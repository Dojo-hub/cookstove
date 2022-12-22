"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Device, {
        foreignKey: 'userId',
        as: "devices"
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      password: DataTypes.STRING,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      isSuperuser: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "User",
      scopes: {
        withoutPassword: {
          attributes: { exclude: ['password'] },
        }
      }
    }
  );
  return User;
};
