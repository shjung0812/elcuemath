// models/tag.js
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "Tag",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true, // 필요에 따라 NOT NULL로 변경 가능
      },
    },
    {
      tableName: "tags", // 실제 데이터베이스 테이블 이름
      timestamps: true, // createdAt, updatedAt 자동 관리
      // underscored: true, // 컬럼명을 스네이크 케이스로 자동 변환
    }
  );

  Tag.associate = (models) => {
    // 한 태그는 여러 콘텐츠에 연결될 수 있음 (N:M 관계)
    Tag.belongsToMany(models.Content, {
      through: "content_tags", // 연결 테이블 이름
      foreignKey: "tagId", // content_tags 테이블에서 이 모델을 참조하는 컬럼
      otherKey: "contentId", // content_tags 테이블에서 다른 모델을 참조하는 컬럼
    });
  };

  return Tag;
};
