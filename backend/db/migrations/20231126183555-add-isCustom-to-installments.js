/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Installments', 'isCustom', {
      type: Sequelize.BOOLEAN
      
    }, options); 
  },

  // this is nothing

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Installments', 'isCustom', options);
  }
};
