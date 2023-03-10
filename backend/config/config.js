const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DEV_DB,
    host: process.env.DB_HOST,
    dialect: "mysql",
    seederStorage: "json",
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.TEST_DB,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.PROD_DB,
    host: process.env.DB_HOST,
    dialect: "mysql",
    seederStorage: "json",
    logging: false,
  },
};
