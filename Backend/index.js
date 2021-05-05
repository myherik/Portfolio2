const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = require('./user');
let User = null;

const scoreModel = require('./score')
let Score = null;

const path = require('path');

let loginList = [{username: "admin", password: "admin"}];

app.use(express.json());

app.post("/login", (req, res) => {
    const { username, password} = req.body;
    if(User !== null){
        User.findOne({username: username}, (err, data) => {
            bcrypt.compare(password, data.password, (err, data) => {
                if (data) {
                    res.status(200).json({
                        status: "OK",
                        body: {
                            username: username
                        }
                    })
                }
                else{
                    res.status(400).json({
                        status: "Error",
                        body: {
                            message: "Wrong username or password"
                        }
                    })
                }
                
            })
            
        });
    }
})

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (password.length <= 5) {
        res.status(400).json({
            body: {
                message: "Invalid password; must have at least 5 carachters"
            }
        })
        return;
    }

    if(User != null) {
        try {
            let bool = true;
            bcrypt.hash(password, 10, (err, data) => {
                let insert = new User({username: username, password: data});
                console.log(insert);
                insert.save((err) => {

                    if (err) {
                        res.status(400).json({
                            body: {
                                message: "Username already in use"
                            }
                        })
                        
                    } else {
                        res.status(201).json({
                            body: {
                                message: "User created"
                            }
                        });
                    }
                });
            });
            
        } catch (err) {
            
        }
    } else {
        res.status(500).json({
            body: {
                message: "DB not available"
            }
        })
    }
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

let highscore = {username: "non", score: 0};

const getHighScore = () => {
    scoreModel.findOne({}).sort({score: "descending"}).exec((err, data) => {
        if (data !== null){
            highscore = data;
        }
    })
}

io.on('connection', (socket) => {
    console.log('new connection users: ' + users)
    socket.on('get-data', obj => {
        if (Score !== null) {
            scoreModel.findOne({username: obj.username}, (err, data) => {
                if (data !== null) {
                    socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood, score: data.score, high: highscore });
                }else{
                    socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood, score: 0, high: highscore });
                }
            })
        }
        
    })

    socket.on('register', (data) => {
        /*
        {
            name: name,
            snake: snake.
            food: food
        }
        */

        
        let ava = true;
        for(let user of users) {
            if (data.name === user) {
                ava = false;
                socket.emit('yeeted', {kicked: true});
            }
        }
        if (ava) {
            userBySoket[socket.id] = data.name;
            users.push(data.name);
            snakes[data.name] = data.snake;
            foods[data.name] = data.food;
    
            socket.broadcast.emit('register', data);
            console.log(data.name + " registered");
        }
    });

    socket.on('update', data => {


        if (userBySoket[socket.id] === undefined) {
            socket.emit('yeeted', {kicked: true})
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

            let score = snakes[user].score;

            delete snakes[user];
            delete userBySoket[socket.id];
            users = users.filter(e => e !== user)

            socket.broadcast.emit('dead', { name: user, food: deadFood });
            scoreModel.findOne({username: user}, (err, data) => {
                if (data !== null) {
                    if (score > data.score) {
                        scoreModel.findByIdAndUpdate(data.id, {score: score}, (err, data) => {

                        })
                    }
                    data.score
                }else{
                    let newScore = new Score({username: user, score: score})
                    newScore.save();
                }
            });

            if (score > highscore.score) {
                console.log("new score")
                highscore = {username:user, score: score}
            }
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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    
})
.then(
    (e) => {
        console.log('connected to db');
        User = userModel;
        Score = scoreModel;
        getHighScore();
    
    },
    (err) => {
        //console.log(err);
        console.log("error")
    })

server.listen(8080, () => {
    console.log(__dirname)
});
