const { Sequelize } = require('sequelize');

const db = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  pool: {
    max: parseInt(process.env.DB_POOL_LIMIT),
    min: 0,
  },
  logging: false,
});

module.exports = { db };