const socket = io();

let updateBool = false;

const socketReg = (regObj) => {
    socket.emit('register', regObj);
}

socket.on('register', regObj => {
    console.log(regObj);
    users.push(regObj.name);

    const outSnake = new Snake(regObj.name);
    outSnake.body = regObj.snake.body;
    outSnake.rgb = regObj.snake.rgb;

    const food = new Food(regObj.food.x, regObj.food.y, regObj.name);

    snakeList[regObj.name] = outSnake;
    foodList[regObj.name] = food;
})

const getData = () => {
    console.log('get-data kalt')
    socket.emit('get-data', "")
}

socket.on('get-data', obj => {
    console.log("get-data motatt")
    updateBool = true;

    console.log(obj.users);

    users = obj.users;
    for (let user of users) {
        const newSnake = new Snake(user);
        newSnake.body = obj.snakes[user].body;
        newSnake.rgb = obj.snakes[user].rgb;
        snakeList[user] = newSnake;
    }
    console.log(snakeList)

})

const update = (regObj) => {
    socket.emit('update', regObj);
}

socket.on('update', (regObj) => {
    //console.log(regObj);
    //const outSnake = new Snake(regObj.name);
    //outSnake.body = regObj.snake.body;
    if (updateBool) {
        snakeList[regObj.name].body = regObj.snake.body;
    }
    //snakeList[regObj.name] = outSnake;
})

const foodUpdate = (food) => {
    socket.emit('foodUpdate', food)
}

socket.on('foodUpdate', (food) => {
    //foodList[food.name].x = food.food.x;
    //foodList[food.name].y = food.food.y;
})

const dead = (name) => {
    socket.emit('dead', { name: name })
}

socket.on('dead', (name) => {
    //users[regObj.name].pop();

    users.splice(users.indexOf(name.name), 1)
    delete snakeList[name.name];
})