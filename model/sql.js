var mysql = require("mysql2");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "new",
  port: "3360",
});

conn.connect((error) => {
  console.log(`connection error: ${error}`);
});

const createTable = () => {
  conn.query(
    `CREATE TABLE auth (
      user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL UNIQUE,
      user_name VARCHAR(255) NOT NULL,
      user_password VARCHAR(255) NOT NULL,
      user_role VARCHAR(255) NOT NULL
    )`,
    (err) => {
      if (err) throw err;
    }
  );

  conn.query(
    `CREATE TABLE mission (
        mission_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        mission_title VARCHAR(255) NOT NULL,
        mission_description TEXT NOT NULL,
        mission_image TEXT NOT NULL
        FOREIGN KEY (user_id) REFERENCES auth(user_id)
    )`,
    (err) => {
      if (err) throw err;
    }
  );
};

module.exports = {
  conn,
  createTable,
};
