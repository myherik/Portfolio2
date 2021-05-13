class Food {

    constructor(x, y, name) {// constructor for food object
        //console.log(x + " " + y)
        this.x = x;
        this.y = y;
        this.food = new Point(this.x, this.y);
        this.name = name;
    }

    show() { // p5 code for showing snake
        if (this.name !== null) {
            fill(150, 50, 70);
            noStroke();
            circle(this.x, this.y, 5);
        } else {
            fill(70, 150, 50);
            noStroke();
            circle(this.x, this.y, 5);
        }

    }

    refreshFood() { // refreshing food when original food is eaten
        let x = Math.floor(Math.random() * 715 + 2.5);
        let y = Math.floor(Math.random() * 495 + 2.5);

        //this = new Food(x, y)
        this.food.x = x;
        this.x = x;
        this.food.y = y;
        this.y = y;
    }
}