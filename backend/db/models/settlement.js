'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settlement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Settlement.belongsTo(models.CalculatorInput,{
        foreignKey: 'inputId',
        as: 'calcInput',
        onDelete: 'CASCADE'
      })
    }
  }
  Settlement.init({
    inputId: DataTypes.INTEGER,
    discountPercentage: DataTypes.DECIMAL,
    isCustom: DataTypes.BOOLEAN,
    settlementAmount: DataTypes.DECIMAL,
    savings: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Settlement',
  });
  return Settlement;
};
