'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log_files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  log_files.init({
    name: DataTypes.STRING,
    parsed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'log_files',
  });
  return log_files;
};