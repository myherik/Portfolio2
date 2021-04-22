class Snake{

    constructor() {
        this.body = [];
        this.x = 0;
        this.y = 0;
        this.body[0] = createVector(this.x, this.y);
        this.xdir = 0;
        this.ydir = 0;
        this.size = 0;
        this.score = 0;
    }

    setDir(x,y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        let head = this.body[this.body.length-1].copy();
        this.body.shift();
        this.x += this.xdir;
        this.y += this.ydir;
        head.x += this.xdir;
        head.y += this.ydir;
        this.body.push(head);
    }

    show() {
        for(let i = 0; i < this.body.length; i++) {
            fill(0);
            noStroke();
            rect(this.body[i].x, this.body[i].y, 5, 5, 2)
        }    
    }

    grow() {
        let head = this.body[this.body.length-1].copy();
        this.len++;
        this.body.push(head);
    }
    

    checkDead(){
        //console.log(this.x + " " + this.y);
        if (this.x < 0 || this.x > 720 || this.y < 0 || this.y > 500){
            return true;
        }
        return false;
    }

    eatFood(food) {
        if (food.food.x - 2.5 < this.x && food.food.x + 2.5 > this.x && food.food.y -2.5 < this.y && food.food.y + 2.5 > this.y) {
            food.refreshFood();
            console.log("treff")
            let i;
            for(i = 0; i < 60; i++){
                this.grow();
            }
            
        } 
        else if (food.food.x - 2.5 < this.x + 5 && food.food.x + 2.5 > this.x + 5 
            && food.food.y -2.5 < this.y + 5 && food.food.y + 2.5 > this.y + 5) {
                food.refreshFood();
                console.log("treff")
                let i;
            for(i = 0; i < 60; i++){
                this.grow();
            }
        } 
        else if (food.food.x - 2.5 < this.x && food.food.x + 2.5 > this.x 
            && food.food.y -2.5 < this.y + 5 && food.food.y + 2.5 > this.y + 5) {
                food.refreshFood();
                console.log("treff")
                let i;
            for(i = 0; i < 60; i++){
                this.grow();
            }
        } 
        else if (food.food.x - 2.5 < this.x + 5 && food.food.x + 2.5 > this.x + 5 
            && food.food.y -2.5 < this.y && food.food.y + 2.5 > this.y) {
                food.refreshFood();
                console.log("treff")
                let i;
            for(i = 0; i < 60; i++){
                this.grow();
            }
        }

        
        return false;
    }
}   