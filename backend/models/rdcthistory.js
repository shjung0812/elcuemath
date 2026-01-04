'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const History = sequelize.define('History', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true, // 이미지상 Not Null 체크가 비어있음
        },
        prbid: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        resultcode: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdate: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        hisopt: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        rconnum: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        cptinfo: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        evalprb: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        teacherid: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    }, {
        tableName: 'rdcthistory', // Correct table name per user request
        timestamps: false,    // 이미지에 createdAt/updatedAt 자동생성 설정이 없으므로 false
    });

    return History;
};