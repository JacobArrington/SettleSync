'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Installment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Installment.belongsTo(models.CalculatorInput,{
        foreignKey: 'calcInputId',
        as: 'calcInput',
        onDelete: 'CASCADE'
      })
    }
  }
  Installment.init({
    calcInputId: DataTypes.INTEGER,
    numberOfInstallment: DataTypes.INTEGER,
    installmentAmount: DataTypes.DECIMAL,
    customNumberOfInstallments: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Installment',
  });
  return Installment;
};
