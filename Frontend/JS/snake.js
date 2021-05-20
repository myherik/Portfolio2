
class Snake {

    constructor(name) {// constructor for snake object
        this.body = [];
        this.points = []
        this.x = Math.floor(Math.random() * ( boardWidth - 20)) + 10;
        this.y = Math.floor(Math.random() * ( boardHeight - 20)) + 10;
        console.log(this.x + " " + this.y)
        this.body[0] = new Point(this.x, this.y);
        this.points[0] = [this.body[0]];
        this.xdir = 0;
        this.ydir = 0;
        this.size = 0;
        this.score = 0;
        this.rgb = this.genColor();
        this.name = name;
        //this.counter = 1;
    }

    setDir(x, y) {// movement direction
        this.xdir = x;
        this.ydir = y;
    }

    genColor() { // gives snake a oolour (included a minimum brightness)
        let rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        while (rgb[0] + rgb[1] + rgb[2] < 275) {
            rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        }
        return rgb;
    }

    show() { // p5 code for showing snake

        textSize(8);
        fill(this.rgb[0], this.rgb[1], this.rgb[2]);
        text(this.name.split("@")[0], this.body[this.body.length - 1].x, this.body[this.body.length - 1].y);


        for (let i = 0; i < this.body.length; i++) {
            fill(this.rgb[0], this.rgb[1], this.rgb[2]);
            noStroke();
            rect(this.body[i].x, this.body[i].y, 5, 5, 2)
        }

    }

    update() {// snakeupdates when moving

        if (this.xdir === 0 && this.ydir === 0) {
            return;
        }


        let head = this.body[this.body.length - 1];
        this.points[this.body.length - 1].push(new Point(this.x, this.y));
        if (this.points[this.body.length - 1].length >= 6) {
            if (this.body.length > 1) {
                this.points[this.body.length - 2].push(this.points[this.body.length - 1].shift());
            } else {
                this.points[this.body.length - 1].shift();
            }
        } else {
            //console.log(this.points[this.body.length - 1].length)
        }
        this.x += this.xdir;
        this.y += this.ydir;
        head.x += this.xdir;
        head.y += this.ydir;

        for (let i = this.body.length - 2; i >= 0; i--) {

            this.body[i].x = this.points[i][this.points[i].length - 1].x;
            this.body[i].y = this.points[i][this.points[i].length - 1].y;

            if (this.points[i].length >= 6) {
                if (i > 0) {
                    this.points[i - 1].push(this.points[i].shift());
                } else {
                    this.points[i].shift();
                }
            }
        }


        let i = 0;
        for (i; i < this.body.length - 1;/* i += 3*/) {
            //console.log("dead? " + i)
            try {
                if (this.x + 3 > this.body[i].x && this.x < this.body[i].x + 3 && (this.y + 3 > this.body[i].y && this.y < this.body[i].y + 3)) {
                    console.log(this.name + " died trying to take a bite of " + this.name + " " + i);
                    return true;
                } else {
                    let diffX = Math.floor(Math.abs(this.x - this.body[i].x) / 5);
                    let diffY = Math.floor(Math.abs(this.y - this.body[i].y) / 5);

                    i += Math.max(diffY + diffX, 1);

                    if (i > this.body.length) {
                        return false;
                    }
                }
            } catch (err) {
                console.log(err);
                return true;
            }
            

        }
        
        return false;


    }

    grow() {// method for growing snake when having had a snack
        const newPoint = new Point(this.points[0][0].x, this.points[0][0].y)
        //console.log(newPoint);
        this.body.unshift(newPoint);
        this.points.unshift([newPoint]);
        this.len++;
        this.score++;
    }


    checkDead() {// checks if snake is dead
        //console.log(this.x + " " + this.y);
        if (this.x < 0 || this.x > deadWidth || this.y < 0 || this.y > deadHeight) {
            return true;
        }
        return false;
    }

    hitSnake(snake) {// checks if I hit another snake
        let i = 0;
        for (i; i < snake.body.length;/* i += 3*/) {
            //console.log("dead? " + snake.name)
            try {
                if (this.x + 5 > snake.body[i].x && this.x < snake.body[i].x + 5 && (this.y + 5 > snake.body[i].y && this.y < snake.body[i].y + 5)) {
                    console.log(this.name + " died trying to take a bite of " + snake.name);
                    return true;
                } else {
                    let diffX = Math.floor(Math.abs(this.x - snake.body[i].x) / 5);
                    let diffY = Math.floor(Math.abs(this.y - snake.body[i].y) / 5);

                    i += diffY + diffX;

                    if (i > snake.body.length) {
                        return false;
                    }
                }
            } catch (err) {
                console.log(err);
                return true;
            }
            

        }
        return false;
    }


    eatFood(food) {// method for doing the act of eating
        ///*
        if (this.x <= food.x + 2.5 && this.x + 5 >= food.x - 2.5 && this.y <= food.y + 2.5 && this.y + 5 >= food.y - 2.5) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                console.log(food.x + " food " + food.y);
                food.x = -10; 
                food.y = -10;
                setDead(deadFood.filter(e => e.x !== -10));
                deadFoodUpdate(deadFood);
            }
            if (this.body.length > 100) {
                if (this.body.length%2 === 0) {
                    this.grow();
                } else {
                    this.score++;
                }

            } else {
                this.grow();
            }
            
        }
        return false;
    }

    copy() {
        //sends ONLY necessary data over the network
        /*
        let copy = new Snake(this.name);
        copy.body = this.body;
        copy.rgb = this.rgb;
        copy.score = this.score;
        */

        return {
            name: this.name,
            body: this.body,
            rgb: this.rgb,
            score: this.score
        };
    }

    changeColor() {// method for changing the colour of the snake
        this.rgb = this.genColor();
    }
}