const SerialPort = require('serialport');
const mysql = require('mysql2');

// Create a connection to the MySQL database
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'rsense',
});

// Open the MySQL connection
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create a new serial port with your COM port configuration
const port = new SerialPort('COM2', {
  baudRate: 9600, // Adjust the baud rate as per your device configuration
});

// Define the MySQL query to insert data into the table
const insertQuery = 'INSERT INTO actual_data (flowRate, totalVolume) VALUES (?, ?)';

// Parse incoming data from the COM port and insert it into the MySQL table
port.on('data', (data) => {
  // Assuming data is received in a format like: flowRate,totalVolume
  const [flowRate, totalVolume] = data.toString().split(',');

  // Insert the data into the MySQL table
  dbConnection.query(insertQuery, [flowRate, totalVolume], (err, results) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
    } else {
      console.log('Data inserted into MySQL:', results);
    }
  });
});

// Handle errors from the COM port
port.on('error', (err) => {
  console.error('Error reading COM port:', err);
});

// Close the MySQL connection when the script exits
process.on('exit', () => {
  dbConnection.end();
});
