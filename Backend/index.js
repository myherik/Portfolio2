'use strict'

const express = require('express');
const app = express();

const path = require('path');

const http = require('http');
const https = require('https');
const server = http.createServer(app);

const fs = require('fs');
const SSLserver = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../SSL', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../SSL', 'cert.pem'))
},
    app);

const { Server } = require("socket.io");
const io = new Server(server);
const sslIO = new Server(SSLserver);

const mongoose = require('mongoose');

//import bcrypt for hashing password
const bcrypt = require('bcrypt');

const Prometheus = require('prom-client')
const registry = new Prometheus.Registry();
registry.setDefaultLabels({app: 'node-app'});

const metricsDings = Prometheus.collectDefaultMetrics({registry});

const updateTotal = new Prometheus.Counter({
    name: 'updateTotal',
    help: 'number of updates',
    labelNames: ['username']
});

const websocketRequestDurationMicroseconds = new Prometheus.Histogram({
    name: 'websocket_request_duration_ms',
    help: 'Duration of websocket requests in ms',
    labelNames: ['route'],
    buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]  // buckets for response time from 0.1ms to 500ms
});

registry.registerMetric(updateTotal);

//Imports for handeling goolge oAuth2
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("381497228886-mmimqoc80fkg0k813q80r20ejhf42npn.apps.googleusercontent.com");

// importing models for handeling insert and find in db
const userModel = require('./user');
let User = null;

const scoreModel = require('./score')
let Score = null;

app.use(express.json());


app.get('/metrics', (req, res) => {
    registry.metrics().then(data => {
        //console.log(data);
        res.setHeader('Content-Type', Prometheus.register.contentType)
        res.end(data);
    });
    
})

// /login endpoint in API
app.post("/login", (req, res) => {

    //getting the username and password from the request
    const { username, password } = req.body;
    // checking that the db is connected
    if (User !== null) {
        // checking if the username is in the db
        User.findOne({ username: username }, (err, data) => {
            if (data) {
                // we have user, checking with bcrypt that the passwords match
                bcrypt.compare(password, data.password, (err, data) => {
                    if (data) {
                        // responding with 200 and the username
                        res.status(200).json({
                            status: "OK",
                            body: {
                                username: username
                            }
                        })
                    }
                    else {
                        // not rigth password error back
                        res.status(400).json({
                            status: "Error",
                            body: {
                                message: "Wrong username or password"
                            }
                        })
                    }

                })
            } else {
                // no user found, 400 error back
                res.status(400).json({
                    status: "Error",
                    body: {
                        message: "Wrong username or password"
                    }
                })
            }
        });
    }
})


// API endpoint for register user
app.post("/register", (req, res) => {
    //getting the username and password from request
    const { username, password } = req.body;
    if (password.length <= 5) {
        // password has to be at least 5 characters
        res.status(400).json({
            body: {
                message: "Invalid password; must have at least 5 carachters"
            }
        })
        return;
    }

    //checking db connection
    if (User != null) {
        try {
            let bool = true;
            //hashing incoming password
            bcrypt.hash(password, 10, (err, data) => {
                // using imported model to create new user
                let insert = new User({ username: username, password: data });
                // saving the user to db
                insert.save((err) => {
                    // save gone bad, username already used
                    if (err) {
                        res.status(400).json({
                            body: {
                                message: "Username already in use"
                            }
                        })

                    } else {
                        // user created, responding with 201 created
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
        // response if db not connected
        res.status(500).json({
            body: {
                message: "DB not available"
            }
        })
    }
})

// API endoint for verifying google
app.post("/google", (req, res) => {
    // verify token from user
    client.verifyIdToken({
        idToken: req.body.token,
        audience: "381497228886-mmimqoc80fkg0k813q80r20ejhf42npn.apps.googleusercontent.com", // Specify the CLIENT_ID of the app that accesses the backend
    }).then((result) => {
        // token is verified and checking db
        if (User != null) {
            // checking if google user has been used before
            User.findOne({ username: result.payload.email }, (err, user) => {
                if (err) {
                    // error in getting from db
                    res.status(500).json({
                        status: 'fail',
                        body: {
                            message: "db error"
                        }
                    })
                } else {
                    // checking if user exist and is google user
                    if (user && user.password === 'google') {
                        // responding that user is found
                        res.status(200).json({
                            status: 'success',
                            body: {
                                message: "token OK",
                                username: result.payload.email
                            }
                        })
                    } else {
                        // no user found and trying to insert new one
                        User.create({ username: result.payload.email, password: "google" }, (errCreate, data) => {
                            // checking for db error
                            if (errCreate) {
                                res.status(400).json({
                                    status: 'fail',
                                    body: {
                                        message: "username used already"
                                    }
                                })
                            } else {
                                // no error checking that we get data from db
                                if (data) {
                                    // responding to forntend with email
                                    res.status(200).json({
                                        status: 'success',
                                        body: {
                                            message: "token OK",
                                            username: result.payload.email
                                        }
                                    })
                                }
                            }

                        })
                    }
                }
            })
        }
    }).catch((err) => {
        // getting erros from google or db and responding
        console.log(err);
        res.status(400).json({
            status: 'fail',
            body: {
                message: "invalid token"
            }
        })
    });
})

// endpoint to get login/register page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/index.html"))
})

//endpoint to get game page
app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/HTML/game.html"))
})

// endpoint to get css files
app.get("/CSS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "Frontend/CSS/" + req.params.file)
})

//endpoint to get js files
app.get("/JS/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../") + "/Frontend/JS/" + req.params.file)
})
// endpoint to get media files
app.get("/Media/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/Media/" + req.params.file))
})

// Variables needed for logic
let userBySoket = {}
let users = [];
let snakes = {};
let foods = {};
let deadFood = [];

let highscore = { username: "non", score: 0 };

// Method to get highscore registered to db
const getHighScore = () => {
    scoreModel.findOne({}).sort({ score: "descending" }).exec((err, data) => {
        if (data !== null) {
            highscore = data;
        }
    })
}

const socketLogic = (socket) => {
    console.log('new connection users: ' + users)
    socket.on('get-data', obj => {
        if (Score !== null) {
            scoreModel.findOne({ username: obj.username }, (err, data) => {
                if (data !== null) {
                    socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood, score: data.score, high: highscore });
                } else {
                    socket.emit('get-data', { users: users, snakes: snakes, foods: foods, deadFood: deadFood, score: 0, high: highscore });
                }
            })
        }

    })
    // Registering client
    socket.on('register', (data) => {
        /* model for data object
        {
            name: name,
            snake: snake.
            food: food
        }
        */
        let ava = true;
        for (let user of users) { // Kicks user if username already in use
            if (data.name === user) {
                ava = false;
                socket.emit('yeeted', { kicked: true });
            }
        }
        if (ava) { // If available registers username and emits to all other connected sockets that are player registered
            userBySoket[socket.id] = data.name;
            users.push(data.name);
            snakes[data.name] = data.snake;
            foods[data.name] = data.food;

            socket.broadcast.emit('register', data);
            console.log(data.name + " registered");
        }
    });

    // websocket endpoint for updating position of snake
    socket.on('update', data => {
        const start = Date.now();

        // you get kicked out if you try to play but not registered
        if (userBySoket[socket.id] === undefined) {
            socket.emit('yeeted', { kicked: true })
        } else {
            // updating snake on server and sending new position to other connected players
            snakes[data.name] = data.snake;
            socket.broadcast.emit('update', data);
            websocketRequestDurationMicroseconds
                .labels('update')
                .observe(Date.now()-start);
            updateTotal.inc({ username: data.name });
        }
    });

    // websocket endpoint for when snake dies
    socket.on('dead', data => {
        let user = userBySoket[socket.id];
        console.log(user + " died");
        if (user !== undefined) {
            let lengthOfDeadfood = deadFood.length;
            let bodyLength = snakes[user].body.length;

            for (let i = 0; i < snakes[user].body.length - 1 && deadFood.length < 100; i++) { // Turns the snakes body into food
                deadFood.push({x: snakes[user].body[i].x, y: snakes[user].body[i].y, name: null});
            }

            let diff = (deadFood.length - lengthOfDeadfood)
            console.log("deadfood " + bodyLength + " " + diff);

            let score = snakes[user].score;

            delete snakes[user]; // removes snake from snakelist
            delete userBySoket[socket.id]; // remove user from userlist by socketID
            users = users.filter(e => e !== user)

            // empties deadfood when no user is playing
            if (users.length === 0) {
                deadFood = []
            }
            checkDeadFood()
            socket.broadcast.emit('dead', { name: user, food: deadFood }); // broadcast that user is dead to all clients
            scoreModel.findOne({ username: user }, (err, data) => { // Getting highscore of the user and updates if bigger than previous
                if (data !== null) {
                    if (score > data.score) {
                        scoreModel.findByIdAndUpdate(data.id, { score: score }, (err, data) => {})
                    }
                    data.score
                } else { // adds score if not already existing
                    let newScore = new Score({ username: user, score: score })
                    newScore.save();
                }
            });

            if (score > highscore.score) {
                console.log("new score")
                highscore = { username: user, score: score }
            }
        }
    })

    socket.on('deadFood', data => { // broadcasts dead food to all clients
        deadFood = data;
        socket.broadcast.emit('deadFood', data);
    })

    socket.on('foodUpdate', data => { // broadcasts new food position to all clients
        foods[data.name] = data.food;
        socket.broadcast.emit('foodUpdate', data)
    })

    socket.on('disconnect', obj => { // broadcasts a disconnected user to all clients and removes from all necessary lists
        let user = userBySoket[socket.id];
        delete userBySoket[socket.id];
        console.log(user + " disconnected");
        if (user !== undefined) { // Same as on 'dead' where snake turns into dead food
            for (let i = 0; i < snakes[user].body.lengt && deadFood.length < 100; i++) {
                deadFood.push({x: snakes[user].body[i].x, y: snakes[user].body[i], name: null});
            }
    
            checkDeadFood();
            socket.broadcast.emit('dead', { name: user, food: deadFood }); // Broadcasts to all clients that snake is gone
            delete snakes[user]; // Deletes snake from socketlist and snakelist
            //users.splice(users.indexOf(user), 1);
            users = users.filter(e => e !== user);

            // empties deadfood when no user is playing
            if (users.length === 0) {
                deadFood = []
            }
        }
    })
}

const checkDeadFood = () => {
    for (let thisFood of deadFood) {
        if (thisFood.x > 350 * users.length - 20 || thisFood.y > 250 * users.length - 20) {
            deadFood.filter(e => e !== thisFood)
        }
    }
}

// Logic for websocket, specifically for connecting client to server
io.on('connection', (socket) => {
    socketLogic(socket);
})

sslIO.on('connection', (socket) => {
    socketLogic(socket);
})

const dbConnect = () => {
    mongoose.connect("mongodb://user:user@mongodb:27017/snakedb", { // Connects to mongodb with mongoose framework
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
        .then(
            (e) => { // If successful in connecting to mongodb
                console.log('connected to db');
                User = userModel;
                Score = scoreModel;
                getHighScore();

            },
            (err) => {// If unsuccessful in connecting to mongodb
                console.log("error connecting to db")
                dbConnect(); // Tries to connect anew
            })
}


server.listen(8080, () => { // Server at port 8080
    console.log("http server");
    dbConnect();
});

SSLserver.listen(8081, () => {
    console.log("https server");
})


// Graceful shutdown
process.on('SIGTERM', () => {
    clearInterval(metricsInterval)

    server.close((err) => {
        if (err) {
        console.error(err)
        process.exit(1)
        }

        process.exit(0)
    })
})