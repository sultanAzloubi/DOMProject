class Node {
    constructor(x, y, p = null){
        this.x = x;
        this.y = y;
        this.p = p;
    }

    getX(){
        return this.x;
    }

    setX(x){
        this.x = x;
    }

    getY(){
        return this.y;
    }

    setY(y){
        this.y = y;
    }
}