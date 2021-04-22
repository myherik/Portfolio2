
let startButton = document.getElementById("start");
//let sketchHere = document.getElementById("sketchHere");

let snake = null;
let food = null;

const foodList = [];

let w, h;

startButton.addEventListener("click", (e) => {
    startButton.style.display =  "none";
    food = new Food(200, 200);
    foodList.push(food);
    snake = new Snake();
    snake.setDir(0,0);
});

function setup(){
    let canvas = createCanvas(720, 500);
    w = width;
    h = height;
    canvas.parent("sketchHere");
    frameRate(120);
}

function draw(){
    background(220);
    if (food !== null) {
        food.show();
    }
    if (snake !== null) {
        snake.update();
        snake.show();
        snake.eatFood(food)
        if (snake.checkDead()){
            snake = null;
            //Hvis highscore etc
            startButton.style.display = "block";
            startButton.innerHTML = "Start på nytt";
        }
    }

}

function  keyPressed() {
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
            if (snake.ydir !== 1) {
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
