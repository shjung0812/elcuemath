const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

// Define model inline to avoid path issues
const Prb = sequelize.define('Prb', {
    prbregi: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    prbid: { type: DataTypes.STRING(25), unique: true },
    prbkorean: { type: DataTypes.TEXT },
    prbpickor: { type: DataTypes.TEXT },
}, {
    tableName: 'prb',
    timestamps: false,
});

async function checkImages() {
    try {
        const problems = await Prb.findAll({
            where: {
                prbpickor: {
                    [Sequelize.Op.ne]: null,
                    [Sequelize.Op.ne]: ''
                }
            },
            limit: 5,
            attributes: ['prbid', 'prbpickor']
        });

        console.log(JSON.stringify(problems, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

checkImages();
