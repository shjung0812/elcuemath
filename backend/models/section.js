// models/section.js
module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Section",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      parentId: {
        // parent_id 컬럼에 해당
        type: DataTypes.BIGINT,
        allowNull: true, // 최상위 섹션은 부모가 없음
        references: {
          model: "Sections", // 자기 참조: 'Sections' 테이블을 참조
          key: "id",
        },
        onDelete: "CASCADE", // 부모 섹션 삭제 시 하위 섹션도 삭제
      },
      slug: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: true, // 필요에 따라 NOT NULL로 변경 가능
      },
      orderIndex: {
        // order_index 컬럼에 해당
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "sections", // 실제 데이터베이스 테이블 이름
      timestamps: true, // createdAt, updatedAt 자동 관리
      // underscored: true, // 컬럼명을 스네이크 케이스로 자동 변환 (예: parentId -> parent_id)
    }
  );

  Section.associate = (models) => {
    // 한 섹션은 여러 하위 섹션을 가질 수 있음 (자식 관계)
    Section.hasMany(models.Section, {
      as: "Children", // 자식 섹션을 가져올 때 사용할 별칭
      foreignKey: "parentId",
    });

    // 한 섹션은 하나의 부모 섹션을 가질 수 있음 (부모 관계)
    Section.belongsTo(models.Section, {
      as: "Parent", // 부모 섹션을 가져올 때 사용할 별칭
      foreignKey: "parentId",
    });

    // 한 섹션은 여러 콘텐츠를 가질 수 있음 (1:N 관계)
    Section.hasMany(models.Content, {
      foreignKey: "sectionId", // content 테이블의 section_id 컬럼
      onDelete: "SET NULL", // 섹션 삭제 시 콘텐츠는 유지, sectionId를 NULL로 설정
    });
  };

  return Section;
};
