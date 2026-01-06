"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const PrismUser = sequelize.define(
        "PrismUser",
        {
            userregi: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(30),
                allowNull: true,
                unique: true, // Key: UNI (Unique 제약 조건)
            },
            password: {
                type: DataTypes.CHAR(40), // 고정 길이 문자열 char(40)
                allowNull: true,
            },
            email: {
                type: DataTypes.CHAR(40),
                allowNull: true,
            },
            DisplayName: {
                type: DataTypes.CHAR(10),
                allowNull: false, // Not Null: [v]
            },
            usersettm: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            position: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },
            regdate: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            tableName: "prismusers", // 실제 테이블명
            timestamps: false,      // 별도의 createdAt/updatedAt 컬럼이 없으므로 false
        }
    );

    PrismUser.associate = (models) => {
        // 필요한 관계 설정을 여기에 추가하세요.
    };

    return PrismUser;
};