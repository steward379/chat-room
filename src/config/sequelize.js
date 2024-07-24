const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = null;

const getSequelize = () => {
  if (!sequelize) {
    sequelize = new Sequelize(process.env.DB_NAME, 
                              process.env.DB_USER, 
                              process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
  return sequelize;
};

module.exports = getSequelize;