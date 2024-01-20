const express = require('express');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const app = express();
const port = 3000;

// Create a serial port object
const arduinoPort = new SerialPort('COM3', { baudRate: 9600 }); // Change 'COM3' to your Arduino's serial port

// Create a parser and pipe the serial port data to it
const parser = arduinoPort.pipe(new Readline({ delimiter: '\r\n' }));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Listen for data from Arduino and update the webpage
parser.on('data', (data) => {
  const [type, value] = data.split(':');

  if (type === 'H') {
    io.emit('updateHeartRate', value);
  } else if (type === 'T') {
    io.emit('updateTemperature', value);
  }
});

// Set up Socket.IO for real-time communication with the webpage
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('A user connected');
});

http.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
