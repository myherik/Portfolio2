
class Snake {

    constructor(name) {
        this.body = [];
        this.points = []
        this.x = Math.floor(Math.random() * 710) + 5;
        this.y = Math.floor(Math.random() * 490) + 5;
        this.body[0] = new Point(this.x, this.y);
        this.points[0] = [];
        this.xdir = 0;
        this.ydir = 0;
        this.size = 0;
        this.score = 0;
        this.rgb = this.genColor();
        this.name = name;
        //this.counter = 1;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    genColor() {
        return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    }

    show() {

        textSize(8);
        fill(this.rgb[0], this.rgb[1], this.rgb[2]);
        text(this.name, this.body[this.body.length - 1].x, this.body[this.body.length - 1].y);


        for (let i = 0; i < this.body.length; i++) {
            fill(this.rgb[0], this.rgb[1], this.rgb[2]);
            noStroke();
            rect(this.body[i].x, this.body[i].y, 5, 5, 2)
        }

    }

    update() {

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


    }

    grow() {

        /*
        head.x += this.xdir * 5;
        head.y += this.ydir * 5;
        this.x += this.xdir * 5;
        this.y += this.ydir * 5;
        this.body.push(head);
        this.dir.push(headDir);
        */
        const newPoint = new Point(this.points[0][0].x, this.points[0][0].y)
        //console.log(newPoint);
        this.body.unshift(newPoint);
        this.points.unshift([newPoint]);
        this.len++;
        this.score++;
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
            //console.log("dead? " + snake.name)
            if (this.x + 5 > snake.body[i].x && this.x < snake.body[i].x + 5 && (this.y + 5 > snake.body[i].y && this.y < snake.body[i].y + 5)) {
                console.log(this.name + " died trying to take a bite of " + snake.name);
                return true;
            }



            /*
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
            */

        }
        return false;
    }


    eatFood(food) {
        ///*
        if (this.x <= food.x + 2.5 && this.x + 5 >= food.x - 2.5 && this.y <= food.y + 2.5 && this.y + 5 >= food.y - 2.5) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                deadFood = deadFood.filter(e => e !== food);
                //console.log(deadFood.length);
                deadFoodUpdate(deadFood);
            }
            this.grow();
        }
        //*/
        /*
        if (food.x - 2.5 < this.x && food.x + 2.5 > this.x && food.y - 2.5 < this.y && food.y + 2.5 > this.y) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                deadFood = deadFood.filter(e => e !== food);
                console.log(deadFood.length);
                deadFoodUpdate(deadFood);
            }

            //console.log("nom nom")
            //let i;
            //for (i = 0; i < 2; i++) {
            //    this.grow();
            //}
            this.grow();
        }
        else if (food.x - 2.5 < this.x + 5 && food.x + 2.5 > this.x + 5
            && food.y - 2.5 < this.y + 5 && food.y + 2.5 > this.y + 5) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                deadFood = deadFood.filter(e => e !== food);
                console.log(deadFood.length);
                deadFoodUpdate(deadFood);
            }
            //console.log("treff")
            this.grow();
        }
        else if (food.x - 2.5 < this.x && food.x + 2.5 > this.x
            && food.food.y - 2.5 < this.y + 5 && food.food.y + 2.5 > this.y + 5) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                deadFood = deadFood.filter(e => e !== food);
                console.log(deadFood.length);
                deadFoodUpdate(deadFood);
            }
            //console.log("food");
            this.grow();
        }
        else if (food.food.x - 2.5 < this.x + 5 && food.food.x + 2.5 > this.x + 5
            && food.food.y - 2.5 < this.y && food.food.y + 2.5 > this.y) {
            if (food.name !== null) {
                food.refreshFood();
                foodUpdate({ food: food, name: food.name })
            } else {
                deadFood = deadFood.filter(e => e !== food);
                console.log(deadFood.length);
                deadFoodUpdate(deadFood);
            }
            //console.log("wihooo");
            this.grow();
        }
        */
        return false;
    }

    copy() {
        let copy = new Snake(this.name);
        copy.body = this.body;
        copy.rgb = this.rgb;
        copy.score = this.score;

        return copy;
    }

    changeColor() {
        this.rgb = this.genColor();
    }
}