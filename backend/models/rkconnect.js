'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RkConnect = sequelize.define('RkConnect', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        parentcol: {
            type: DataTypes.STRING(15),
        },
        childcol: {
            type: DataTypes.STRING(16),
        },
        createdate: {
            type: DataTypes.STRING(22),
        },
        rkorder: {
            type: DataTypes.INTEGER,
        },
        conid: {
            type: DataTypes.STRING(16),
        },
        conkind: {
            type: DataTypes.STRING(15),
        },
    }, {
        tableName: 'rkconnect',
        timestamps: false,
    });

    return RkConnect;
};