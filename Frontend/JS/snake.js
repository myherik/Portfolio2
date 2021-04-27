
class Snake {

    constructor(name) {
        this.body = [];
        this.x = width / 2;
        this.y = height / 2;
        this.body[0] = new Point(this.x, this.y);
        this.xdir = 0;
        this.ydir = 0;
        this.size = 0;
        this.score = 0;
        this.rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.name = name;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        let head = this.body[this.body.length - 1].copy();
        this.body.shift();
        this.x += this.xdir;
        this.y += this.ydir;
        head.x += this.xdir;
        head.y += this.ydir;
        this.body.push(head);
    }

    show() {

        textSize(8);
        text(this.name, this.body[this.body.length - 1].x, this.body[this.body.length - 1].y);
        fill(this.rgb[0], this.rgb[1], this.rgb[2]);

        for (let i = 0; i < this.body.length; i++) {
            fill(this.rgb[0], this.rgb[1], this.rgb[2]);
            noStroke();
            rect(this.body[i].x, this.body[i].y, 5, 5, 2)
        }
    }

    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.len++;
        this.body.push(head);
    }


    checkDead() {
        //console.log(this.x + " " + this.y);
        if (this.x < 0 || this.x > 720 || this.y < 0 || this.y > 500) {
            return true;
        }
        return false;
    }

    hitSnake(snake) {
        let i = 0;
        for (i; i < snake.body.length; i++) {
            if (this.x - 2.5 < snake.body[i].x && this.x + 2.5 > snake.body[i].x
                && this.y - 2.5 < snake.body[i].y && this.y + 2.5 > snake.body[i].y) {
                console.log(this.name + " died trying to take a bite of " + snake.name);
                return true;
            }
            else if (this.x - 2.5 < snake.body[i].x + 5 && this.x + 2.5 > snake.body[i].x + 5
                && this.y - 2.5 < snake.body[i].y + 5 && this.y + 2.5 > snake.body[i].y + 5) {
                console.log(this.name + " died trying to take a bite of " + snake.name);
                return true;
            }
            else if (this.x - 2.5 < snake.body[i].x && this.x + 2.5 > snake.body[i].x
                && this.y - 2.5 < snake.body[i].y + 5 && this.y + 2.5 > snake.body[i].y + 5) {
                console.log(this.name + " died trying to take a bite of " + snake.name);
                return true;
            }
            else if (this.x - 2.5 < snake.body[i].x + 5 && this.x + 2.5 > snake.body[i].x + 5
                && this.y - 2.5 < snake.body[i].y && this.y + 2.5 > snake.body[i].y) {
                console.log(this.name + " died trying to take a bite of " + snake.name);
                return true;
            }
        }
        return false;
    }


    eatFood(food) {
        if (food.food.x - 2.5 < this.x && food.food.x + 2.5 > this.x && food.food.y - 2.5 < this.y && food.food.y + 2.5 > this.y) {
            food.refreshFood();
            foodUpdate({ food: food, name: food.name })
            console.log("nom nom")
            let i;
            for (i = 0; i < 60; i++) {
                this.grow();
            }

        }
        else if (food.food.x - 2.5 < this.x + 5 && food.food.x + 2.5 > this.x + 5
            && food.food.y - 2.5 < this.y + 5 && food.food.y + 2.5 > this.y + 5) {
            food.refreshFood();
            foodUpdate({ food: food, name: food.name })
            console.log("treff")
            let i;
            for (i = 0; i < 60; i++) {
                this.grow();
            }
        }
        else if (food.food.x - 2.5 < this.x && food.food.x + 2.5 > this.x
            && food.food.y - 2.5 < this.y + 5 && food.food.y + 2.5 > this.y + 5) {
            food.refreshFood();
            foodUpdate({ food: food, name: food.name })
            console.log("treff")
            let i;
            for (i = 0; i < 60; i++) {
                this.grow();
            }
        }
        else if (food.food.x - 2.5 < this.x + 5 && food.food.x + 2.5 > this.x + 5
            && food.food.y - 2.5 < this.y && food.food.y + 2.5 > this.y) {
            food.refreshFood();
            foodUpdate({ food: food, name: food.name })
            console.log("treff")
            let i;
            for (i = 0; i < 60; i++) {
                this.grow();
            }
        }


        return false;
    }
}