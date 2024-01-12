const SerialPort = require('serialport').SerialPort;
const mysql = require('mysql');
const path = require('path');

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'rsense'
});

SerialPort.list().then(
  ports => ports.forEach(console.log),
  err => console.error(err)
)


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Open the serial port
const port = new SerialPort('COM2', {
  baudRate: 9600
});

port.on('data', (data) => {
  // Parse the incoming data
  const [flowRate, totalVolume] = data.toString().split(',');

  // Insert the data into the MySQL database
  const sql = `INSERT INTO actual_data (flowRate, totalVolume) VALUES (${flowRate}, ${totalVolume})`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Data inserted');
  });
});
