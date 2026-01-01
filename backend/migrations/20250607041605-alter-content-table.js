// migrations/YYYYMMDDHHmmss-add-fields-to-content-table.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. id 컬럼 타입 변경 (INTEGER -> BIGINT)
    // 이 부분은 데이터베이스 종류에 따라 구문이 다를 수 있습니다.
    // MySQL의 경우 MODIFY COLUMN, PostgreSQL의 경우 ALTER COLUMN TYPE을 사용합니다.
    // autoIncrement와 primaryKey는 해당 타입에 맞게 재정의됩니다.
    // await queryInterface.changeColumn("content", "id", {
    //   type: Sequelize.BIGINT,
    //   // primaryKey: true,
    //   autoIncrement: true,
    //   allowNull: false,
    // });

    // 2. quill_content 컬럼 타입 변경 (JSON -> LONGTEXT)
    // 기존 JSON 데이터가 TEXT로 저장되므로 유의하세요.
    // await queryInterface.changeColumn("content", "quill_content", {
    //   type: Sequelize.TEXT("long"), // LONGTEXT에 해당
    //   allowNull: false,
    // });

    // 3. status 컬럼 추가
    // await queryInterface.addColumn("content", "status", {
    //   type: Sequelize.STRING(50),
    //   defaultValue: "draft",
    //   allowNull: false,
    // });

    // 4. section_id 컬럼 추가 (외래 키 포함)
    // 'sections' 테이블이 먼저 생성되어 있어야 합니다.
    await queryInterface.addColumn("content", "section_id", {
      type: Sequelize.BIGINT,
      allowNull: true, // 섹션에 속하지 않는 콘텐츠도 허용
      references: {
        model: "sections", // 참조할 테이블 이름 (스네이크 케이스)
        key: "id",
      },
      onDelete: "SET NULL", // 참조하는 섹션 삭제 시, 콘텐츠의 section_id를 NULL로 설정
    });

    // 5. published_at 컬럼 추가
    await queryInterface.addColumn("content", "published_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // 마이그레이션을 롤백할 때 수행될 작업
    // 추가된 컬럼들을 제거하고, 변경된 컬럼들을 원래대로 되돌립니다.

    // 1. published_at 컬럼 제거
    await queryInterface.removeColumn("content", "published_at");

    // 2. section_id 컬럼 제거 (외래 키 제약조건도 함께 제거됨)
    await queryInterface.removeColumn("content", "section_id");

    // 3. status 컬럼 제거
    await queryInterface.removeColumn("content", "status");

    // 4. quill_content 컬럼 타입 원복 (TEXT -> JSON)
    // 주의: TEXT에 저장된 데이터가 JSON 형식에 맞지 않을 경우 오류 발생 가능성
    await queryInterface.changeColumn("content", "quill_content", {
      type: Sequelize.JSON,
      allowNull: false,
    });

    // 5. id 컬럼 타입 원복 (BIGINT -> INTEGER)
    await queryInterface.changeColumn("content", "id", {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    });
  },
};
