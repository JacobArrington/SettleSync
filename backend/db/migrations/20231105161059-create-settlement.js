'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; 
   // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settlements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inputId: {
        type: Sequelize.INTEGER,
        references:{
          model: 'CalculatorInput',
          key: 'id'
        },
        onDelete: 'CASCADE'
      
      },
      discountPercentage: {
        type: Sequelize.DECIMAL
      },
      isCustom: {
        type: Sequelize.BOOLEAN
      },
      settlementAmount: {
        type: Sequelize.DECIMAL
      },
      savings: {
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
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Settlements";
    return queryInterface.dropTable(options);
  }

};
