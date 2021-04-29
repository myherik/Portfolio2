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

let deadFood = [];

io.on('connection', (socket) => {
    console.log('new connection users: ' + users)
    socket.on('get-data', obj => {
        //console.log(snakes);
        socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood})
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
        console.log(data.name + " registered");
    });

    socket.on('update', data => {
        /*
        if (userBySoket[socket.id] === undefined) {
            console(data.name + " re registered");
            userBySoket[socket.id] = data.name;
            users.push(data.name);
            snakes[data.name] = data.snake;
            socket.broadcast.emit('register', data)
        }
        */

        snakes[data.name] = data.snake;
        socket.broadcast.emit('update', data);
    });

    socket.on('dead', data => {
        let user = userBySoket[socket.id];
        console.log(user + " died");
        if (user !== undefined) {
            for (let bodypart of snakes[user].body) {
                deadFood.push(bodypart);
            }
            socket.broadcast.emit('dead', { name: user, food: deadFood });
            delete snakes[user];
            delete userBySoket[socket.id];
            //users.splice(users.indexOf(user), 1);
            users = users.filter(e => e !== user)
        }
    })

    socket.on('deadFood', data => {
        deadFood = data;
        socket.broadcast.emit('deadFood', data);
    })

    socket.on('foodUpdate', data => {
        foods[data.name] = data.food;
        socket.broadcast.emit('foodUpdate', data)
    })

    socket.on('disconnect', obj => {
        let user = userBySoket[socket.id];
        console.log(user + " disconnected");
        if (user !== undefined) {
            for (let bodypart of snakes[user].body) {
                deadFood.push(bodypart);
            }
            socket.broadcast.emit('dead', { name: user, food: deadFood });
            delete snakes[user];
            delete userBySoket[socket.id];
            //users.splice(users.indexOf(user), 1);
            users = users.filter(e => e !== user);
        }
    })
})

server.listen(8080, () => {
    console.log(__dirname)
});
