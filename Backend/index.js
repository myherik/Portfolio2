const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(8080, () => {

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Frontend/HTML/index.html")
})

app.get("/css", (req, res) => {
    res.sendFile(__dirname + "/Frontend/CSS/main.css")
})

app.get("/js", (req, res) => {
    res.sendFile(__dirname + "/Frontend/JS/sketch.js")
})


io.on('connection', socket => {

    socket.on('register', data => {
        /*
        {
            name: name,
            snake: snake
        }
        */

        socket.subscribe.emit(data);
        console.log(data);
    });

    socket.on('update', data => {
        socket.subscribe.emit(data);
    });
})