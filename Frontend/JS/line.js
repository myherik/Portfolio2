class Line {
    constructor(xa, ya, xb, yb) {
        this.xa = xa;
        this.ya = ya;

        this.xb = xb;
        this.yb = yb;
    }
    copy(){
        return new Line(this.xa, this.ya, this.xb, this.yb)
    }
}