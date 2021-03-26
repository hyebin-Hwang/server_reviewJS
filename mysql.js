const mysql = require("mysql");
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@@da8611zi",
  database: "DB_reviewJS",
});

module.exports = conn;
