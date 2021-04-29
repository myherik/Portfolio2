
class Snake2 {
    constructor(name) {
        this.body = [];
        this.x = Math.floor(Math.random() * 710) + 5;
        this.y = Math.floor(Math.random() * 490) + 5;
        this.a = this.x;
        this.b = this.y;
        this.turningPoint = new Point(this.x, this.y);
        this.xdir = 0;
        this.ydir = 0;
        this.size = 0;
        this.score = 0;
        this.rgb = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.name = name;
        this.line = new Line(this.x, this.y, this.a, this.b);
        this.body[0] = this.turningPoint;
        this.body[1] = this.line
    }
    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }
    show() {
        textSize(8);
        fill(this.rgb[0], this.rgb[1], this.rgb[2]);
        text(this.name, this.body[this.body.length - 1].x, this.body[this.body.length - 1].y);

        let numberOfLines = (this.body.length) / 2;
        let counter = 1;
        let length = 0;
        for (numberOfLines; numberOfLines > 0; numberOfLines--) {
            fill(this.rgb[0], this.rgb[1], this.rgb[2]);
            noStroke();
            if (this.body[counter].xa == this.body[counter].xb) {
                length = Math.abs(this.body[counter].ya - this.body[counter].yb);
                rect(this.body[counter].xa, this.body[counter].ya, 5, length, 2);
            }
            else {
                length = Math.abs(this.body[counter].xa - this.body[counter].xb);
                rect(this.body[counter].xa, this.body[counter].ya, length, 5, 2);
            }
            if(numberOfLines != 0){
                counter = counter + 2;
            }
            
        }

        /*
        for (let i = 0; i < this.body.length; i++) {
            fill(this.rgb[0], this.rgb[1], this.rgb[2]);
            noStroke();
            rect(this.body[i].x, this.body[i].y, 5, 5, 2)
        }
        */

    }
}