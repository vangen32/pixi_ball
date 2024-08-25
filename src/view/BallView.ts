import {Assets, Sprite, Texture} from "pixi.js";
import {Position} from "../models/Position";
import {Size} from "../models/Size";

export class BallView{
    private _ballSprite : Sprite = new Sprite();
    get ballSprite() : Sprite{
        return this._ballSprite;
    }
    private ballPosition : Position = new Position(0,0)
    private ballRadius : number = 20;
    private ballSpeed : number = 0;

    constructor(texture : Texture, position : Position, radius : number, clickHandler : ()=>{}) {
        this._ballSprite = new Sprite(texture);
        this._ballSprite.eventMode = "dynamic";
      /*  this.ballSprite.on("pointerup", e=>this.onBallClickHandler(
            new Size(this.fieldContainer!.width, this.fieldContainer!.height),
            this.ballPosition,
            this.ballSpeed
        ))*/
        this._ballSprite.on("pointerup", e=>clickHandler())
        this.ballPosition.update(position.x, position.y)
        this._ballSprite.anchor.x = 0.5;
        this._ballSprite.anchor.y = 0.5;
    }

    static async GetBallInstance(){
        const texture = await Assets.load('ball.png');
    }
}