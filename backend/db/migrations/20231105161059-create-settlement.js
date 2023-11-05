'use strict';
/** @type {import('sequelize-cli').Migration} */
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
        type: Sequelize.INTEGER
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Settlements');
  }
};