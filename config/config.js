const dotenv = require("dotenv");
dotenv.config();

const envList  = {
  "development": {
    "username": "root",
    "password": process.env.PASSWORD,
    "database": "hack",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
module.exports = envList;