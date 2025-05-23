'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('content','quill_content',{
      type:Sequelize.JSON,
      allowNull:false
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('content','quill_content',{
      type:Sequelize.TEXT,
      allowNull:false
    })
  
  }
};
