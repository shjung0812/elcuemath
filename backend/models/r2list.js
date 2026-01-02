'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const R2List = sequelize.define('R2List', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        r2listinfo: {
            type: DataTypes.TEXT,
        },
        r2id: {
            type: DataTypes.STRING(15),
        },
        createdate: {
            type: DataTypes.STRING(22),
        },
        r2order: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'r2list', // 이미지의 컬럼 구조를 담는 테이블 명칭
        timestamps: false,
    });

    return R2List;
};