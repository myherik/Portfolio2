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
        rect(0, 0, 1, boardHeight + 3);

        //rigth border wall
        fill(255);
        noStroke();
        rect(boardWidth + 2, 0, 1, boardHeight + 3);

        //top border wall
        fill(255);
        noStroke();
        rect(0, 0, boardWidth + 3, 1);

        //bottom border wall
        fill(255);
        noStroke();
        rect(0, boardHeight + 2, boardWidth + 3, 1);

        /*

        fill(255);
        noStroke();
        rect(100, 30, 200, 5);

        fill(255);
        noStroke();
        rect(560, 430, 5, 20);
    
        fill(255);
        noStroke();
        rect(252, 129, 20, 5);

        fill(255);
        noStroke();
        rect(130, 129, 5, 20);

        fill(255);
        noStroke();
        rect(160, 198, 5, 30);

        fill(255);
        noStroke();
        rect(200, 44, 5, 80);

        fill(255);
        noStroke();
        rect(350, 128, 5, 90);

        fill(255);
        noStroke();
        rect(10, 44, 5, 70);
        
        */
    
    }
}