const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3306;

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'z5zm8hebixwywy9d.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'pztb7abynvs1legf',
  password: 'dmfjs4ft3zh82nns',
  database: 'jawsdblangenheim',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// Set up a route to fetch data from the database
app.get('/', (req, res) => {
  db.query('SELECT * FROM test', (error, results) => {
    if (error) throw error;
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MySQL Connection with Node.js</title>
      </head>
      <body>
        <table border="1">
          <tr>
            <th>ID</th>
          </tr>
          ${results.map((row) => `
            <tr>
              <td>${row.idname}</td>
            </tr>`).join('')}
        </table>
      </body>
      </html>
    `);
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
