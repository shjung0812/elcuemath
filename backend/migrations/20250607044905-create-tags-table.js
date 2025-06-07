// migrations/YYYYMMDDHHmmss-create-tags-table.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 'tags' 테이블 생성
    await queryInterface.createTable("tags", {
      id: {
        type: Sequelize.BIGINT, // ID 범위 확장을 위해 BIGINT 사용
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true, // 태그 이름은 중복될 수 없음
      },
      slug: {
        type: Sequelize.STRING(100),
        unique: true, // URL 친화적 이름도 중복될 수 없음
        allowNull: true, // 필요에 따라 NOT NULL로 변경 가능
      },
      createdAt: {
        // Sequelize timestamps: true에 의해 자동 생성되는 컬럼
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // DB 기본값 설정
      },
      updatedAt: {
        // Sequelize timestamps: true에 의해 자동 생성되는 컬럼
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // DB 기본값 설정
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // 업데이트 시 자동 변경
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // 마이그레이션 롤백 시 'tags' 테이블 제거
    await queryInterface.dropTable("tags");
  },
};
