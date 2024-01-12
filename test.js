const SerialPort = require('serialport').SerialPort;

SerialPort.list().then(
  ports => ports.forEach(console.log),
  err => console.error(err)
)
