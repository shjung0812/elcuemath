'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MmcpHomework = sequelize.define('MmcpHomework', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        mmcpid: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        prbid: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        mpicid: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        createdate: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        mmcpconid: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        mpicorder: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        timepassec: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        operationid: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        timeallocat: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        roundnum: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'mmcphomework',
        timestamps: false,
    });

    return MmcpHomework;
};