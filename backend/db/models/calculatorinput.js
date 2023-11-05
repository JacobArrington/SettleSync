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
     CalculatorInput.belongsTo(models.RepaymentCalculator,{
      foreignKey: 'calcId',
      as: 'repayCalc',
      onDelete: 'CASCADE'
     })
     CalculatorInput.hasMany(models.Installment,{
      foreignKey: 'calcInputId',
      as: 'installments',
      onDelete: 'CASCADE'
     })
     CalculatorInput.hasMany(models.CustomInputs,{
      foreignKey: 'calcInputId',
      as: 'custom',
      onDelete: 'CASCADE'
     })
     CalculatorInput.hasMany(models.Settlement,{
      foreignKey: 'inputId',
      as: 'settlement',
      onDelete: 'CASCADE'
      
     })
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
