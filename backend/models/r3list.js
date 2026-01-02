'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const R3List = sequelize.define('R3List', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        listinfo: {
            type: DataTypes.TEXT,
        },
        r3id: {
            type: DataTypes.STRING(15),
        },
        createdate: {
            type: DataTypes.STRING(22),
        },
        r3order: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'r3list',
        timestamps: false,
    });

    return R3List;
};