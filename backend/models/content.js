"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Content = sequelize.define(
    "Content",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quill_content: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      sectionId: {
        // section_id 컬럼에 해당
        type: DataTypes.BIGINT,
        allowNull: true, // 섹션에 속하지 않는 콘텐츠도 허용
        references: {
          model: "Sections", // Section 테이블 참조
          key: "id",
        },
        onDelete: "SET NULL", // 섹션 삭제 시 콘텐츠의 sectionId를 NULL로 설정
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
      // 기타 콘텐츠 관련 필드 추가 가능
    },
    {
      tableName: "content",
      timestamps: false,
    }
  );

  Content.associate = (models) => {
    // 한 콘텐츠는 하나의 섹션에 속함 (N:1 관계)
    Content.belongsTo(models.Section, {
      foreignKey: "sectionId",
    });

    // 한 콘텐츠는 여러 태그를 가질 수 있음 (N:M 관계)
    Content.belongsToMany(models.Tag, {
      through: "content_tags", // 연결 테이블 이름
      foreignKey: "contentId", // content_tags 테이블에서 이 모델을 참조하는 컬럼
      otherKey: "tagId", // content_tags 테이블에서 다른 모델을 참조하는 컬럼
    });
  };

  return Content;
};
