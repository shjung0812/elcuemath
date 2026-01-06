"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const MmttConnection = sequelize.define(
        "MmttConnection",
        {
            numid: {
                type: DataTypes.INTEGER.UNSIGNED, // int unsigned
                primaryKey: true,                // Key: PRI
                autoIncrement: true,             // Extra: auto_increment
                allowNull: false,                // Not Null: [v]
            },
            parentcol: {
                type: DataTypes.STRING(30),      // varchar(30)
                allowNull: true,                 // Not Null: [ ]
            },
            childcol: {
                type: DataTypes.TEXT,            // text
                allowNull: true,                 // Not Null: [ ]
            },
            conopt: {
                type: DataTypes.INTEGER,         // int
                allowNull: true,                 // Not Null: [ ]
            },
        },
        {
            tableName: "mmttconnection",       // 실제 테이블명
            timestamps: false,                 // 이미지상 생성/수정일 컬럼이 없으므로 false
            underscored: true,
        }
    );

    MmttConnection.associate = (models) => {
        // 필요한 경우 여기에 관계 설정 (예: HasMany, BelongsTo 등)을 추가하세요.
    };

    return MmttConnection;
};