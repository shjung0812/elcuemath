"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 3. (Implicit) No specific step 3, just a logical continuation from 2 to 4.

    // 4. sectionId 컬럼 추가 (외래 키 포함)
    // 'sections' 테이블이 먼저 생성되어 있어야 합니다.
    await queryInterface.addColumn("content", "sectionId", {
      type: Sequelize.BIGINT,
      allowNull: true, // 섹션에 속하지 않는 콘텐츠도 허용
      references: {
        model: "sections", // 참조할 테이블 이름 (스네이크 케이스)
        key: "id",
      },
      onDelete: "SET NULL", // 참조하는 섹션 삭제 시, 콘텐츠의 sectionId를 NULL로 설정
    });

    // 5. publishedAt 컬럼 추가
    await queryInterface.addColumn("content", "publishedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverting changes in reverse order

    // 1. publishedAt 컬럼 제거
    await queryInterface.removeColumn("content", "publishedAt");

    // 2. sectionId 컬럼 제거 (외래 키 제약조건도 함께 제거됨)
    await queryInterface.removeColumn("content", "sectionId");
  },
};
