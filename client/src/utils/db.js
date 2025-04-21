import mysql from 'mysql2/promise';

// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '', // add your password if set
//   port: 3306,
//   database: 'skyroute' // replace with your database name
// });

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

export default db;