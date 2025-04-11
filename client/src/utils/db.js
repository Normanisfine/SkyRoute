import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // add your password if set
  port: 3306,
  database: 'skyroute' // replace with your database name
});

export default db;