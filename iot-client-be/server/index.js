const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const amqp = require('amqplib/callback_api');

const port = 3000;
const rabbitHost = process.env.RABBIT_HOST;
const amqpConnectionString = 'amqp://' + rabbitHost;

let bufferArray = [];

amqp.connect(amqpConnectionString, function(error, connection) {
    connection.createChannel(function(error, channel) {
        var queue = 'com.datatroniq.iot-task.piped.view';

        channel.consume(queue, function(msg) {
            bufferArray.push(JSON.parse(msg.content));
        }, {
            noAck: true
        });
    });
});

setInterval(function () {
  io.sockets.emit('telemetry', bufferArray);
  bufferArray = [];
}, 200);

io.on('connection', function (socket) {
  console.log('a user connected');
});

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});