'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Installments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      calcInputId: {
        type: Sequelize.INTEGER
      },
      numberOfInstallment: {
        type: Sequelize.INTEGER
      },
      installmentAmount: {
        type: Sequelize.DECIMAL
      },
      customNumberOfInstallments: {
        type: Sequelize.INTEGER
      },
      isCustom: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Installments');
  }
};