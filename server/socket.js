const express = require("express");
const app = express();
const server = require("http").createServer(app);
const webSocketIO = require("socket.io")(server); 
const PORT = 8080;

webSocketIO.on('connection', socket => {
    console.log("connected");

    socket.on('videoframes', data => {
        console.log(data);
        socket.emit('videoframes', data);
    })

    socket.on('echo', data => {
        console.log("echo", data);
        socket.emit('echo', data);
    });

    socket.on('disconnect', () => {
        console.log("socket disconnected!");
    });

    socket.on('error', err => {
        console.log('socket.io socket error:'+ err);
    })
});

webSocketIO.on('error', err => {
    console.log('socket.io bounded app error:'+err);
});

server.listen(PORT, () => {
    console.log("http and websocket listening on *:" + PORT);
});
