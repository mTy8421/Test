// sql.js
const mysql = require("mysql2/promise");

async function createConnection() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "new",
    port: "3360",
  });
  console.log("Connected to the database");
  return conn;
}

module.exports = { createConnection };
