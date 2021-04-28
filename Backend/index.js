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

let userBySoket = {}
let users = [];
let snakes = {};
let foods = {};

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('get-data', obj => {

        socket.emit('get-data', { users: users, snakes: snakes, foods: foods })
    })

    socket.on('register', (data) => {
        /*
        {
            name: name,
            snake: snake.
            food: food
        }
        */

        userBySoket[socket.id] = data.name;
        users.push(data.name);
        snakes[data.name] = data.snake;
        foods[data.name] = data.food;

        socket.broadcast.emit('register', data);
        console.log(data);
    });

    socket.on('update', data => {
        snakes[data.name] = data.snake;
        socket.broadcast.emit('update', data);
    });

    socket.on('dead', data => {
        let user = userBySoket[socket.id];
        console.log(user + " died");
        if (user !== undefined) {
            socket.broadcast.emit('dead', data);
            delete snakes[user];
            users.splice(users.indexOf(user), 1);
        }
    })

    socket.on('foodUpdate', data => {
        foods[data.name] = data.food;
        socket.broadcast.emit('foodUpdate', data)
    })

    socket.on('disconnect', obj => {
        let user = userBySoket[socket.id];
        console.log(user + " disconnected");
        if (user !== undefined) {
            socket.broadcast.emit('dead', { name: user });
            delete snakes[user];
            users.splice(users.indexOf(user), 1);
        }
    })
})

server.listen(8080, () => {
    console.log(__dirname)
});
