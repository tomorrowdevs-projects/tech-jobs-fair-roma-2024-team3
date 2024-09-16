const { Sequelize, Model, DataTypes } = require('sequelize');
const { pg } = require('pg');

const sequelize = new Sequelize(
    'postgres://default:XpHGgi3OYVk0@ep-twilight-math-a25t6gqn-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require'
    , {
    dialect: 'postgres',
    dialectModule: pg
});

class User extends Model { }
User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
}, { sequelize, modelName: 'user' });

sequelize.sync();

module.exports = User;