const mysql = require('mysql2')
const promisemysql = require('mysql2/promise');
require('dotenv').config();


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'MaggieMaeSmolka',
    database: 'employee_db'
  },
  console.log('Connected to the employee database.')
);

module.exports = db;