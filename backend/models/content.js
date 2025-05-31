'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Content = sequelize.define('Content', {
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
  }, {
    tableName: 'content',
    timestamps: false,
    underscored: true,
  });

//   Content.associate = function(models) {
//     Content.belongsToMany(models.Category, {
//       through: 'Content_Categories',
//       foreignKey: 'content_id',
//       otherKey: 'category_id',
//       as: 'categories',
//     });
//     Content.belongsToMany(models.Tag, {
//       through: 'Content_Tags',
//       foreignKey: 'content_id',
//       otherKey: 'tag_id',
//       as: 'tags',
//     });
//   };

  return Content;
};