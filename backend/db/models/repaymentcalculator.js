'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RepaymentCalculator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RepaymentCalculator.init({
    userId: DataTypes.INTEGER,
    calcName: DataTypes.STRING,
    creationDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RepaymentCalculator',
  });
  return RepaymentCalculator;
};