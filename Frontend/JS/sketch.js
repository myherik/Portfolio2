
let startButton = document.getElementById("start");
//let sketchHere = document.getElementById("sketchHere");

(() => {
    getData();
})();

let snake = null;
let food = null;

let users = [];
let snakeList = {};
let foodList = {};

let deadFood = [];

const setDead = (list) => {
    deadFood = list;
}

let name = null;

let w, h;

startButton.addEventListener("click", (e) => {
    if (snake === null) {
        startGame();
    }
});

document.getElementById("input-name").addEventListener("keypress", (e) => {
    if (snake === null && e.keyCode === ENTER) {
        startGame();
        document.getElementById("input-name").blur();
    }
})



const startGame = () => {
    name = document.getElementById("input-name").value;
    getData();

    startButton.style.display = "none";
    while (snake === null) {
        let testSnake = new Snake(document.getElementById("input-name").value);
        let available = true;
        for (let user of users) {
            if (testSnake.hitSnake(snakeList[user])) {
                available = false;
                break;
            }
        }
        if (available) {
            snake = testSnake;
        }
    }
    while (food === null) {
        let tempx = Math.floor(Math.random() * 715 + 2.5);
        let tempy = Math.floor(Math.random() * 495 + 2.5);
        let bool = true;
        for (let user of users) {
            if (foodList[user].x === tempx && foodList[user].y === tempy) {
                bool = false;
                break;
            }
        }
        if (!bool) {
            continue;
        }
        food = new Food(tempx, tempy, snake.name);
        console.log("food is made!");
        break;
    }

    foodList[snake.name] = food;
    snake.setDir(0, 0);
    const obj = {
        name: document.getElementById("input-name").value,
        snake: snake,
        food: food
    };
    socketReg(obj)
}

function setup() {
    let canvas = createCanvas(720, 500);
    w = width;
    h = height;
    canvas.parent("sketchHere");
    //frameRate(12);
    frameRate(60);
}

let counter = 1;

function draw() {
    counter++;

    background(220);

    if (food !== null) {
        food.show();
    }

    if (snake !== null) {
        snake.update();
        snake.show();
        snake.eatFood(food);

        update({
            name: snake.name,
            snake: snake.copy(),
            food: food
        });

        //console.log(deadFood.length)
        if (counter %5 === 0) {
            for (let foodEl of deadFood) {
                foodEl.show();
                snake.eatFood(foodEl);
            }
        } else {
            for (let foodEl of deadFood) {
                foodEl.show();
            }
        }
        

        for (let user of users) {
            foodList[user].show();
            snakeList[user].show();
            if (counter %5 === 0) {
                snake.eatFood(foodList[user])
                if (snake.hitSnake(snakeList[user])) {
                    dead(snake.name, food);
                    food = null;
                    snake = null;
                    startButton.style.display = "block";
                    startButton.innerHTML = "Start på nytt";
                }
            }
            
        }

        if (counter %5 === 0) {
            if (snake !== null && snake.checkDead()) {
                dead(snake.name, food);
                food = null;
                snake = null;
                //vis highscore etc
                startButton.style.display = "block";
                startButton.innerHTML = "Start på nytt";
            }
        }

        

    } else {
        for (let foodEl of deadFood) {
            foodEl.show();
        }

        for (let user of users) {
            snakeList[user].show();
            foodList[user].show();
        }
    }

    if (counter %5 === 0) {
        counter = 1;
    }

}

function keyPressed() {
    if (snake !== null) {
        if (keyCode === LEFT_ARROW) {
            if (snake.xdir !== 1) {
                snake.setDir(-1, 0);
            }
        } else if (keyCode === RIGHT_ARROW) {
            if (snake.xdir !== -1) {
                snake.setDir(1, 0);
            }
        } else if (keyCode === DOWN_ARROW) {
            if (snake.ydir !== -1) {
                snake.setDir(0, 1);
            }
        } else if (keyCode === UP_ARROW) {
            if (snake.ydir !== 1) {
                snake.setDir(0, -1);
            }
        } else if (key == ' ') {
            snake.setDir(0, 0);
        }
        else if (key == 'm') {
            snake.grow();
            console.log(snake.copy());
        }
        else if (key == 'c') {
            snake.changeColor();
        }
        else if (key == 'v') {
            console.log(snake);
            if (users.length !== 0) {
                console.log(snakeList[users[0]]);
            }
        }
    } 
}
