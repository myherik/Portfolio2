const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');

const path = require('path');

let loginList = [{username: "admin", password: "admin"}];

app.use(express.json());

app.post("/login", (req, res) => {
    let boolean = false;
    const { username, password } = req.body;
    for (let user of loginList) {
        if (user.username === username) {
            if (user.password === password) {
                res.status(200).json({
                    body: {username: username}
                });
                boolean = true;
            }
        }
    }
    if (!boolean) {
        res.status(400).json({
            body: "invalid username or password"
        });
    }
})

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    loginList.push({ username: username, password: password });
    res.status(201).json({
        body: "OK"
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/index.html"))
})

app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/game.html"))
})

app.get("/CSS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "Frontend/CSS/" + req.params.file)
})

app.get("/JS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "/Frontend/JS/" + req.params.file)
})

app.get("/Media/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/Media/" + req.params.file))
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
        socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood })
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


        if (userBySoket[socket.id] === undefined) {
            console.log(data.name + " re registered");
            userBySoket[socket.id] = data.name;
            users.push(data.name);
            snakes[data.name] = data.snake;
            socket.broadcast.emit('register', data)

        }



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

mongoose.connect("mongodb://user:user@mongodb:27017/snakedb", {
    useNewUrlParser: true/*,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    */
})
.then(
    (e) => {
        console.log('connected to db');
    },
    (err) => {
        //console.log(err);
        console.log("error")
    })

server.listen(8080, () => {
    console.log(__dirname)
});
