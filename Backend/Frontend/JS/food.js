class Food{

    constructor(x, y){
        console.log(x + " " + y)
        this.x = x;
        this.y = y;
        this.food = createVector(this.x, this.y);
    }

    show() {
        fill(150, 50, 70);
        noStroke();
        circle(this.x, this.y, 5);
    }

    refreshFood() {
        let x = Math.floor(Math.random() * 715 + 2.5);
        let y = Math.floor(Math.random() * 495 + 2.5);

        //this = new Food(x, y)
        this.food.x = x;
        this.x = x;
        this.food.y = y;
        this.y = y;
    }
}