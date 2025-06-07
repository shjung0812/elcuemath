// migrations/YYYYMMDDHHmmss-create-sections-table.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 'sections' 테이블 생성
    await queryInterface.createTable("sections", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      // parent_id 컬럼: 자기 참조 외래 키
      parentId: {
        // 모델에서 parentId로 정의했더라도, underscored: true가 아니면 DB에서는 parentId로 생성됩니다.
        // 만약 underscored: true를 사용하신다면 여기도 parent_id로 바꿔주세요.
        // 여기서는 모델 정의와 일치하게 parentId로 두겠습니다.
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "sections", // 자기 자신 테이블을 참조 (소문자로)
          key: "id",
        },
        onDelete: "CASCADE",
      },
      slug: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: true,
      },
      orderIndex: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        // timestamps: true에 의해 자동 생성되는 컬럼
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // DB 기본값 설정
      },
      updatedAt: {
        // timestamps: true에 의해 자동 생성되는 컬럼
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // DB 기본값 설정
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // 업데이트 시 자동 변경
      },
    });

    // slug 컬럼에 UNIQUE 제약조건 추가 (테이블 생성 시 함께 정의했으므로 이 부분은 필요 없을 수 있으나,
    // 명시적으로 추가하는 경우를 대비해 예시로 둡니다. 이미 unique: true로 정의했으므로 대부분 필요 없습니다.)
    // await queryInterface.addConstraint('sections', {
    //   fields: ['slug'],
    //   type: 'unique',
    //   name: 'sections_slug_unique_constraint'
    // });
  },

  async down(queryInterface, Sequelize) {
    // 마이그레이션 롤백 시 'sections' 테이블 제거
    await queryInterface.dropTable("sections");
  },
};
