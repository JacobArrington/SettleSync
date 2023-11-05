'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CalculatorInput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CalculatorInput.init({
    calcId: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL,
    lumpSum: DataTypes.DECIMAL,
    remainderAfterLump: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'CalculatorInput',
  });
  return CalculatorInput;
};