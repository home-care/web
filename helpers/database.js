const mysql = require("mysql");

module.exports = class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
  }
  connect() {
    this.connection.connect();
  }

  query(query, inserts = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, inserts, (err, results) => {
        if (err) reject(error);
        resolve(results);
      });
    });
  }

  disconnect() {
    this.connection.end();
  }
};
