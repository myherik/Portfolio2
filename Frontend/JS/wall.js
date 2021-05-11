class Wall{
    constructor(){
        /*
        this.left = {top: {x: 0, y : 0}, bottom: {x: 0, y: 500*scaleVar}}
        this.rigth = {top: {x: 720*scaleVar, y : 0}, bottom: {x: 720*scaleVar, y: 500*scalevar}}
        this.top = {left: {x: 0, y: 0}, right: {x: 720*scaleVar, y : 0}};
        this.bottom = {left: {x: 0, y = 500*scaleVar}, right: {x: 720*scaleVar, y = 500*scaleVar}};
        */
    }

    show() {
        //left
        fill(255);
        noStroke();
        rect(0, 0, 1, 503);
        
        //rigth
        fill(255);
        noStroke();
        rect(720 + 2, 0, 1, 503);
        
        //top
        fill(255);
        noStroke();
        rect(0, 0, 723, 1);
        
        //bottom
        fill(255);
        noStroke();
        rect(0, 500 + 2, 723, 1);
        
    }
}