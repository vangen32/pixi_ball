export class Position {
    constructor(private _x : number, private _y : number) {
    }
    get x() : number{
        return this._x;
    }
    get y() : number {
        return this._y;
    }
    update(x : number, y : number){
        this._x = x;
        this._y = y;
    }
}