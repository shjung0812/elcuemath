'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => { // sequelize 인스턴스를 인자로 받음
  const Prb = sequelize.define('Prb', {
    prbregi: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    prbid: {
      type: DataTypes.STRING(25),
      unique: true,
      allowNull: false,
    },
    prbkorean: {
      type: DataTypes.TEXT,
    },
    prbenglish: {
      type: DataTypes.TEXT,
    },
    prbchinese: {
      type: DataTypes.TEXT,
    },
    prbpickor: {
      type: DataTypes.TEXT,
    },
    source: {
      type: DataTypes.STRING(50),
    },
  }, {
    tableName: 'prb',
    timestamps: false,
  });
  return Prb;
};