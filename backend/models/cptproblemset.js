'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CptProblemSet = sequelize.define('CptProblemSet', {
        numid: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        prblist: {
            type: DataTypes.TEXT,
            allowNull: false, // Not Null 반영
        },
        listinfo: {
            type: DataTypes.STRING(100),
        },
        createdate: {
            type: DataTypes.STRING(20),
            allowNull: false, // Not Null 반영
        },
        cptid: {
            type: DataTypes.STRING(20),
            allowNull: false, // Not Null 반영
        },
        userid: {
            type: DataTypes.STRING(20),
        },

        cptoption: {
            type: DataTypes.STRING(50),
        },
    }, {
        tableName: 'cptproblemset',
        timestamps: false,
    });

    return CptProblemSet;
};