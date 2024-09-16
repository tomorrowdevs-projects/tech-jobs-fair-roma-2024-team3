const { Sequelize, Model, DataTypes } = require('sequelize');
// const { pg } = require('pg');


const sequelize = new Sequelize(process.env.POSTGRES_URL, {
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