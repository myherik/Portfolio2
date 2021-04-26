
let startButton = document.getElementById("start");
//let sketchHere = document.getElementById("sketchHere");

let snake = null;
let food = null;

//let foodList = [];

let users = [];
let snakeList = {};
let foodList = {};

let w, h;

startButton.addEventListener("click", (e) => {
    console.log(users.indexOf("finnesIkke"));
    startButton.style.display = "none";
    snake = new Snake(document.getElementById("input-name").value);
    food = new Food(200, 200, snake.name);
    foodList[snake.name] = food;
    snake.setDir(0, 0);
    const obj = {
        name: document.getElementById("input-name").value,
        snake: snake,
        food: food
    };
    socketReg(obj)
});

function setup() {
    let canvas = createCanvas(720, 500);
    w = width;
    h = height;
    canvas.parent("sketchHere");
    frameRate(120);
}

function draw() {
    background(220);
    for (let user of users) {
        foodList[user].show();
    }
    if (food !== null) {
        food.show();
    }

    if (snake !== null) {
        snake.update();
        snake.show();
        update({
            name: snake.name,
            snake: snake
        });
        snake.eatFood(food)
        if (snake.checkDead()) {
            dead(snake.name);
            snake = null;
            //vis highscore etc
            startButton.style.display = "block";
            startButton.innerHTML = "Start på nytt";
        }
    }

    for (let user of users) {
        snakeList[user].show();
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
        }
    }
}
