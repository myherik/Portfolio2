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
    //console.log('get-data kalt')
    socket.emit('get-data', "")
}

socket.on('get-data', obj => {
    //console.log("get-data motatt")
    updateBool = true;

    //console.log(obj.users);

    users = obj.users;
    for (let user of users) {
        const newSnake = new Snake(user);
        newSnake.body = obj.snakes[user].body;
        newSnake.rgb = obj.snakes[user].rgb;
        snakeList[user] = newSnake;

        const newFood = new Food(0, 0, user);
        newFood.x = obj.foods[user].x;
        newFood.y = obj.foods[user].y;
        foodList[user] = newFood;
    }

    let newDeadFood = [];
    for (let foorish of obj.deadFood) {
        newDeadFood.push(new Food(foorish.x, foorish.y, null));
    }
    setDead(newDeadFood);

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
        snakeList[regObj.name].rgb = regObj.snake.rgb;
    }
    //snakeList[regObj.name] = outSnake;
})

const foodUpdate = (foodObj) => {
    socket.emit('foodUpdate', foodObj)
}

socket.on('foodUpdate', (foodObj) => {
    if (foodObj.name === snake.name) {
        food.x = foodObj.food.x;
        food.y = foodObj.food.y;
    } else {
        foodList[foodObj.name].x = foodObj.food.x;
        foodList[foodObj.name].y = foodObj.food.y;
    }
})

const deadFoodUpdate = (deadFood) => {
    socket.emit('deadFood', deadFood);
}

socket.on('deadFood', (deadFood) => {
    let newList = [];
    for (let dead of deadFood) {
        newList.push(new Food(dead.x, dead.y, null));
    }

    console.log(newList.length);
    setDead(newList);
    //console.log(deadFood.length);

})

const dead = (name, infood) => {
    infood.name = null;
    deadFood.push(infood);

    deadFoodUpdate(deadFood);
    socket.emit('dead', { name: name })
}

socket.on('dead', (name) => {
    //users[regObj.name].pop();

    //users.splice(users.indexOf(name.name), 1)
    users = users.filter(e => e !== name.name)
    delete snakeList[name.name];

    for (let mat of name.food) {
        const thisfood = new Food(mat.x, mat.y, null);
        deadFood.push(thisfood);
    }

})