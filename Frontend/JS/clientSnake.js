const socket = io(); // creates socket connection

let updateBool = false;

const socketReg = (regObj) => {// emits register object to register endpoint in server websocket
    socket.emit('register', regObj);
}

socket.on('register', regObj => {// on registering recieving information from server

    // adds the snake to the list in sketch
    const outSnake = new Snake(regObj.name);
    outSnake.body = regObj.snake.body;
    outSnake.rgb = regObj.snake.rgb;

    const food = new Food(regObj.food.x, regObj.food.y, regObj.name);

    snakeList[regObj.name] = outSnake;
    foodList[regObj.name] = food;
    users.push(regObj.name);
    setUpdate();
})

const getData = (name) => { // emits getting data method to endpoint in server websocket
    //console.log('get-data kalt')
    socket.emit('get-data', { username: name })
}

socket.on('get-data', obj => { // recieving data from server and using that data to play the game
    //console.log("get-data motatt")
    updateBool = true;

    document.getElementById("pb").innerText = `Highscore: ${obj.score}`;
    document.getElementById("all-time").innerText = `By: ${obj.high.username.split("@")[0]} with the score ${obj.high.score}`;

    users = obj.users //.filter(name => name !== snake.name);
    for (let user of users) { // Does everything necessary to make your snake able to play the game
        const newSnake = new Snake(user);
        newSnake.body = obj.snakes[user].body;
        newSnake.rgb = obj.snakes[user].rgb;
        newSnake.score = obj.snakes[user].score;
        snakeList[user] = newSnake;

        const newFood = new Food(0, 0, user);
        newFood.x = obj.foods[user].x;
        newFood.y = obj.foods[user].y;
        foodList[user] = newFood;
    }

/*
    let newDeadFood = [];
    for (let foorish of obj.deadFood) {// pushes dead food to list
        newDeadFood.push(new Food(foorish.x, foorish.y, null));
    }
    */
    setDead(obj.deadFood); // sends deadfoodlist to sketch

    setUpdate();
    startGame(); // starts game

})

const update = (regObj) => {// emits update method to server socket
    socket.emit('update', regObj);
}

socket.on('update', (regObj) => { // recieves updated data from server to client
    console.log("update");
    //const outSnake = new Snake(regObj.name);
    //outSnake.body = regObj.snake.body;
    if (updateBool) { // updatebool makes sure that you can't recieve updates until all information has been loaded
        snakeList[regObj.name].body = regObj.snake.body;
        snakeList[regObj.name].rgb = regObj.snake.rgb;
        if (snakeList[regObj.name].score !== regObj.snake.score) {
            snakeList[regObj.name].score = regObj.snake.score;
            users.sort((a, b) => snakeList[b].score - snakeList[a].score);
        }

    }
    //snakeList[regObj.name] = outSnake;
})

socket.on('newUpdate', (snakeListInn) => {
    console.log("newUpdate")
    if (updateBool) {
        for (let user of users) {
            snakeList[user].body = snakeListInn[user].body;
            snakeList[user].score = snakeListInn[user].score;
            snakeList[user].rgb = snakeListInn[user].rgb;
        }

        users.sort((a, b) => snakeList[b].score - snakeList[a].score);
    }
    
})

const foodUpdate = (foodObj) => { // emits updates on food to server
    socket.emit('foodUpdate', foodObj)
}

socket.on('foodUpdate', (foodObj) => { // recieves updates on food from server
    if (snake !== null && foodObj.name === snake.name) { // if food is my snakes food
        food.x = foodObj.food.x;
        food.y = foodObj.food.y;
    } else {
        foodList[foodObj.name].x = foodObj.food.x;
        foodList[foodObj.name].y = foodObj.food.y;
    }
})

const deadFoodUpdate = (deadFood) => { // emits updates on deadFood to server
    socket.emit('deadFood', deadFood);
}

socket.on('deadFood', (deadFood) => { // recieves updates on deadFood from server
    /*let newList = [];
    for (let dead of deadFood) {
        let newFood = new Food(dead.x, dead.y, null);
        newFood.showFood = dead.showFood;
        newList.push();
    }
    */
    setDead(deadFood);
})

const dead = (name, infood) => {// emits that my snake has died to server
    infood.name = null;
    deadFood.push(infood); // makes deadfood out of me

    deadFoodUpdate(deadFood); // updates to everyone
    socket.emit('dead', { name: name })
}

socket.on('dead', (name) => { // recieves any updates of death
    //users[regObj.name].pop();
    //users.splice(users.indexOf(name.name), 1)
    users = users.filter(e => e !== name.name) // removes dead snake from lists
    delete snakeList[name.name];

    setDead(name.food);

    console.log("resize")
    setUpdate();

})

socket.on('yeeted', (data) => { // kicks you and forces you to go back to login page (index.html)
    if (data.kicked === true) {
        window.location.href = "/"
    }
})

socket.on('meg', data => {
    console.log(data);
})