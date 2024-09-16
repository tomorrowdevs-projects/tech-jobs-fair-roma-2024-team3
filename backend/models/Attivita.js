const { Sequelize, Model, DataTypes } = require('sequelize');
// const { pg } = require('pg');


const sequelize = new Sequelize(
    'postgres://default:XpHGgi3OYVk0@ep-twilight-math-a25t6gqn-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require'
    , {
    dialect: 'postgres',
    // dialectModule: pg
});

class Attivita extends Model { }
Attivita.init({
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: 'attivita'});

sequelize.sync();

module.exports = Attivita;