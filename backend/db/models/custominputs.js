'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomInputs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     CustomInputs.belongsTo(models.CalculatorInput,{
      foreignKey: 'calcInputId',
      as: 'calcInput',
      onDelete: 'CASCADE'
     })
    }
  }
  CustomInputs.init({
    calcInputId: DataTypes.INTEGER,
    customMonthlyPayment: DataTypes.DECIMAL,
    interestRate: DataTypes.DECIMAL,
    customMonthsToPay: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CustomInputs',
  });
  return CustomInputs;
};
