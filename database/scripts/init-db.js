const fs = require('fs');
const mysql = require('mysql');

const sql = fs.readFileSync('/app/01-schema.sql', 'utf8');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.code);
    process.exit(1);
  }

  console.log('Connected to RDS MySQL');

  connection.query(sql, (error) => {
    if (error) {
      console.error('Schema initialization failed:', error.code, error.sqlMessage);
      connection.end();
      process.exitCode = 1;
      return;
    }

    console.log('Database schema initialized successfully');

    connection.query('SHOW TABLES', (tableError, tables) => {
      if (tableError) {
        console.error('Table verification failed:', tableError.code);
        process.exitCode = 1;
      } else {
        console.log('Tables found:', tables.length);
        console.log(tables.map(row => Object.values(row)[0]).join(', '));

        if (tables.length !== 13) process.exitCode = 1;
      }

      connection.end();
    });
  });
});
