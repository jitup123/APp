const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 5000;

let onlineUsers = 0;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    onlineUsers++;
    io.emit('online users', onlineUsers); // Broadcast the online user count to all clients

    socket.on('send name', (username) => {
        io.emit('send name', username);
    });

    socket.on('send message', (chat) => {
        io.emit('send message', chat);
    });

    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username); // Broadcast to all clients except the sender
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing');
    });

    socket.on('disconnect', () => {
        onlineUsers--;
        io.emit('online users', onlineUsers); // Update online user count when someone disconnects
    });
});

server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});
