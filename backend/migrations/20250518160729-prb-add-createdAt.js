'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction=>{
      return Promise.all(
        [
          queryInterface.addColumn(
            'prb',

            'createdAt',
            {
              type:Sequelize.DATE,
              allowNull:true,
              defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
            },
            {transaction}
          ),
          queryInterface.addColumn(
          'prb', // 실제 테이블 이름으로 변경해야 합니다.
          'updatedAt',
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          { transaction }
        ),
        ]
      )
    })

  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(transaction => {
      return Promise.all([
        queryInterface.removeColumn('prb', 'createdAt', { transaction }), // 실제 테이블 이름으로 변경해야 합니다.
        queryInterface.removeColumn('prb', 'updatedAt', { transaction }), // 실제 테이블 이름으로 변경해야 합니다.
      ]);
    });
  }
  
};
