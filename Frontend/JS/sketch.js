// all variables needed for drawing the game

let startButton = document.getElementById("start");

let name = null;

let snake = null;
let food = null;

let users = [];
let snakeList = {};
let foodList = {};

let deadFood = [];

const setDead = (list) => {
    deadFood = list;
}

const wall = new Wall();

let w, h;

let scaleVar = 2;

startButton.addEventListener("click", (e) => { // method for clicking startbutton
    if (snake === null) {
        getData(name)
    }
});

const showPlayers = () => {// shows other players
    let htmlUserList = `<p>${snake.name.split("@")[0]}</p>`;
    for (let user of users) {
        htmlUserList += `<p>${user.split("@")[0]}</p>`;
    }
    document.getElementById("placePlayersHere").innerHTML = htmlUserList;
}

const showScores = () => { // shows scores of other active players

    document.getElementById("realtime").innerHTML = `Score: ${snake.score}`;
    let scoreList = "<p>";
    for (let i = 0; i < Math.min(10, users.length); i++) {
        let user = users[i];
        scoreList += `<p>${user.split("@")[0]}: ${snakeList[user].score}</p>`
    }
    scoreList += "</p>";
    document.getElementById("placePlayerScoresHere").innerHTML = scoreList;
}


const startGame = () => { // method for starting the game
    document.getElementById("inYourFace").classList.add("hidden") // deathmessage is hidden
    startButton.style.display = "none"; // hides startbutton 
    while (snake === null) {// as long as snake have not been created yet
        let testSnake = new Snake(name);
        console.log("testSnake")
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
    while (food === null) { // as long as food is not been able to be created yet
        let tempx = Math.floor(Math.random() * (boardWidth - 10) + 5);
        let tempy = Math.floor(Math.random() * (boardHeight - 10) + 5);
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
        name: name,
        snake: snake.copy(),
        food: food
    };
    socketReg(obj) // registers object
}

let boardWidth = 360;
let boardHeight = 250;
let updateSize = true;
let updateSnake = false;

let deadWidth = boardWidth;
let deadHeight = boardHeight;

let adjustment = 50

const setUpdate = () => {
    updateSize = true;
    updateSnake = true;
}

const checkSnakes = () => {
    if (snake === null) {
        return true;
    }
    return (snake.x < boardWidth - (adjustment + 5) && snake.y < boardHeight - (adjustment + 5));
}

const setSize = () => {

    if (boardWidth < 360 + adjustment*users.length) {
        boardWidth++;
        boardHeight++;
    } else if (boardWidth > 360 + adjustment*users.length) {
        boardWidth--;
        boardHeight--;

        if (food !== null) {
            if (food.x > boardWidth - (adjustment + 5) || food.y > boardHeight - (adjustment + 5)) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
        }
    }
    } else if (updateSize || updateSnake) {
        if (updateSize) {
            setCanvas();
            updateSize = false;
        }
        if (checkSnakes()) {
            deadWidth = boardWidth;
            deadHeight = boardHeight;
            updateSnake = false;
        }
    }

}

let canvas = null;
function setup() {// creates canvas for drawing and places into html
    canvas = createCanvas(boardWidth * scaleVar + 100, boardHeight * scaleVar + 100);
    //canvas = createCanvas(1000, 1000)
    canvas.style.margin = "0";
    w = width;
    h = height;
    canvas.parent("sketchHere");
    frameRate(60);
}

const setCanvas = () => { // when zooming in or out canvas is redrawn for you
    resizeCanvas(boardWidth * scaleVar + 100, boardHeight * scaleVar + 100);
}

let counter = 1;

const showDeadFood = (el) => {
    fill(70, 150, 50);
    noStroke();
    circle(el.x, el.y, 5);
}

function draw() { // method called 60 times per second for drawing the game

    scale(scaleVar);
    counter++;
    background(45, 48, 58);

    wall.show();

    if (food !== null) {
        food.show();
    }

    if (snake !== null) {
        if (snake.update()) {
            endGame();
            return;
        }

        snake.show();
        snake.eatFood(food);

        update({ // sends updates
            name: snake.name,
            snake: snake.copy(),
            food: food
        });

        //console.log(deadFood.length)
        if (counter % 5 === 0) { // everything we thing is not necessary to update EVERY frame, so we do it every 5 frames
            scrollSnake();
            showScores();
            showPlayers();
            for (let foodEl of deadFood) {
                showDeadFood(foodEl)
                snake.eatFood(foodEl);
            }
            if (snake !== null && snake.checkDead()) {
                console.log("out of bounds");
                endGame();
                return;
            }
        } else {
            for (let foodEl of deadFood) {
                showDeadFood(foodEl);
            }
        }


        for (let user of users) {
            foodList[user].show();
            snakeList[user].show();
            if (counter % 5 === 0) {
                snake.eatFood(foodList[user])
                if (snake.hitSnake(snakeList[user])) {
                    console.log("HIT SNAKE");
                    endGame();
                    return;
                }
            }

        }

    } else {
        // when dead
        for (let foodEl of deadFood) {
            showDeadFood(foodEl);
        }

        for (let user of users) {
            snakeList[user].show();
            foodList[user].show();
        }
    }

    if (counter % 5 === 0) {
        counter = 1;
    }

    setSize(); 

}

const scrollSnake = () => {// method for scrolling the game if zoomed enough in
    let widthOfScreen = window.innerWidth;
    let heightOfScreen = window.innerHeight;
    let sketch = document.getElementById("sketchHere");
    //console.log(sketch.offsetHeight + " " + sketch.offsetWidth)

    sketch.scroll({
        top: snake.y * scaleVar - sketch.offsetHeight / 2 - 5,
        left: snake.x * scaleVar - sketch.offsetWidth / 2 - 5,
        behavior: 'smooth'
    });
    
    /*
    sketch.scroll({
        top: snake.y - boardHeight / 2,
        left: snake.x - boardWidth/ 2,
        behavior: 'smooth'
    });
    */

}

const endGame = () => { // method for ending the game
    dead(snake.name, food);
    food = null;
    snake = null;
    startButton.style.display = "block";
    document.getElementById("inYourFace").classList.remove("hidden");
}

const showHelp = () => {
    const help = document.getElementById("help");
    const scores = document.getElementById("scores");
    if (help.classList.contains("hidden")) {
        help.classList.remove("hidden");
        scores.classList.add("hidden");
    } else {
        help.classList.add("hidden");
        scores.classList.remove("hidden");
    }
}

function keyPressed() { // every game mechanic for pressing a button 
    if (snake !== null) {
        if (keyCode === LEFT_ARROW || key == 'a') {// left
            if (snake.xdir !== 1) {
                snake.setDir(-1, 0);
            }
        } else if (keyCode === RIGHT_ARROW || key == 'd') {// right
            if (snake.xdir !== -1) {
                snake.setDir(1, 0);
            }
        } else if (keyCode === DOWN_ARROW || key == 's') {// down
            if (snake.ydir !== -1) {
                snake.setDir(0, 1);
            }
        } else if (keyCode === UP_ARROW || key == 'w') {// up
            if (snake.ydir !== 1) {
                snake.setDir(0, -1);
            }
        } else if (key == ' ') {// testing purposes only pausing the game
            snake.setDir(0, 0);
        }/*
        else if (key == 'm') {// testing purposes only growing without eating
            snake.grow();
            console.log(snake.copy());
        }*/
        else if (key == 'c') {// canges colour of snake if you're not happy with it
            snake.changeColor();
        }
        else if (key == 'h') {
            showHelp();
        }
        else if (key == 'v') {// testing purposes only logging the snake
            console.log(snake);
            if (users.length !== 0) {
                console.log(snakeList[users[0]]);
                console.log(users);
            }
        } /*else if (key == 'n') {// testing purposes only showing snakes position in canvas
            console.log(snake.x + " " + snake.y)
        }*/ else if (key == '-') {// zoom out
            scaleVar -= 0.1
            setCanvas();
        } else if (key == '+') {// zoom in
            scaleVar += 0.1
            setCanvas();
        }
    } else {
        if (key == 'h') {
            showHelp();
        }
    }
}


(() => {
    name = sessionStorage.getItem("username");// stores username in session (if not you're yeeted to login page)
    if (name !== null) {
        getData(name);
    } else {
        window.location.href = "/";
    }
})();