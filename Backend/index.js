const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/index.html"))
})

app.get("/CSS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "Frontend/CSS/" + req.params.file)
})

app.get("/JS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "/Frontend/JS/" + req.params.file)
})

io.on('connection', (socket) => {

    socket.on('register', (data) => {
        /*
        {
            name: name,
            snake: snake
        }
        */

        socket.broadcast.emit('register', data);
        console.log(data);
    });

    socket.on('update', data => {
        socket.broadcast.emit('update', data);
    });

    socket.on('dead', data => {
        socket.broadcast.emit('dead', data);
    })

    socket.on('foodUpdate', data => {
        socket.broadcast.emit('foodUpdate', data)
    })
})

server.listen(8080, () => {
    console.log(__dirname)
});
