'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CalculatorInputs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calcId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'RepaymentCalculator',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      balance: {
        type: Sequelize.DECIMAL
      },
      lumpSum: {
        type: Sequelize.DECIMAL
      },
      remainderAfterLump: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CalculatorInputs');
  }
};
