'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
   // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CustomInputs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calcInputId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'CalculatorInput',
          key: 'id'
        },
        onDelete: 'CASCADE'
      
      },
      customMonthlyPayment: {
        type: Sequelize.DECIMAL
      },
      interestRate: {
        type: Sequelize.DECIMAL
      },
      customMonthsToPay: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('CustomInputs');
  }
};
