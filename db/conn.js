const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

const sequelize = new Sequelize(DB_URI, {
  define: {
    timestamps: false
  }
});

module.exports = sequelize;
