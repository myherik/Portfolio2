class Wall {
    constructor() {// Constructor was made, but we figured we didn't need it after all
        /*
        this.left = {top: {x: 0, y : 0}, bottom: {x: 0, y: 500*scaleVar}}
        this.rigth = {top: {x: 720*scaleVar, y : 0}, bottom: {x: 720*scaleVar, y: 500*scalevar}}
        this.top = {left: {x: 0, y: 0}, right: {x: 720*scaleVar, y : 0}};
        this.bottom = {left: {x: 0, y = 500*scaleVar}, right: {x: 720*scaleVar, y = 500*scaleVar}};
        */
    }

    show() {
        //left border wall
        fill(255);
        noStroke();
        rect(0, 0, 1, 503);

        //rigth border wall
        fill(255);
        noStroke();
        rect(720 + 2, 0, 1, 503);

        //top border wall
        fill(255);
        noStroke();
        rect(0, 0, 723, 1);

        //bottom border wall
        fill(255);
        noStroke();
        rect(0, 500 + 2, 723, 1);

        fill(255);
        noStroke();
        rect(100, 30, 200, 5);

        fill(255);
        noStroke();
        rect(560, 430, 5, 20);
    }
}