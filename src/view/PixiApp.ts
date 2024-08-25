import {Application, Assets, Container, PointData, Sprite} from 'pixi.js';
import {Border} from "../border";
import {Size} from "../models/Size";
import {Position} from "../models/Position";

type StartClickHandler = (fieldSize : Size, ballPosition : Position, ballSpeed : number) => void;

export class PixiApp{
    private static _pixiApp : PixiApp;
    private readonly app : Application;
    private ballSprite : Sprite = new Sprite();
    private ballPosition : Position = new Position(0,0)
    private ballRadius : number = 20;
    private ballSpeed : number = 0;
    private border? : Border;


    private onBallClickHandler : StartClickHandler = (fieldSize : Size, ballPosition : Position)=>{}

    get ticker(){
        return this.app.ticker
    }

    private constructor() {
        this.app = new Application()
    }

    private setDebugMode(){
        if(process.env.NODE_ENV !==" production")
            (globalThis as any).__PIXI_APP__ =  this.app;
    }

    public static async InitApp(container : HTMLElement) : Promise<PixiApp> {
        if(PixiApp._pixiApp)
            return PixiApp._pixiApp;

        const pixiApp = new PixiApp();

        pixiApp.setDebugMode()
        await pixiApp.app.init({
            background: '#1099bb',
            resizeTo: container,
            width: container.offsetWidth,
            height: container.offsetHeight,
        });
        await pixiApp.setBall();

        container.appendChild(pixiApp.app.canvas)
        pixiApp.app.ticker.add(pixiApp.update.bind(pixiApp))
        return pixiApp;
    }

    async setBall(){
        const texture = await Assets.load('ball.png');
        this.ballSprite = new Sprite(texture);
        this.ballSprite.eventMode = "dynamic";
        this.ballSprite.on("pointerup", e=>this.onBallClickHandler(
            new Size(this.app.renderer.width, this.app.renderer.height),
            this.ballPosition,
            this.ballSpeed
        ))
        this.ballPosition.update(this.app.renderer.width / 2, this.app.renderer.height / 2)

        this.ballSprite.anchor.x = 0.5;
        this.ballSprite.anchor.y = 0.5;

        this.app.stage.addChild(this.ballSprite);
    }

    update(){
            this.ballSprite.position = this.ballPosition;
            this.ballSprite.setSize({
                width: this.ballRadius * 2,
                height: this.ballRadius * 2
            })
        if(this.ballSpeed>1)
            this.ballSprite.angle += 2;
        else if(this.ballSpeed<=1 && this.ballSpeed>0)
            this.ballSprite.angle += 0.5;
    }

    drawBorder(size : Size, cof : number){
         this.border = Border.CreateBorder(this.app.stage,
           /*new Size(container.offsetWidth, container.offsetHeight),*/
             size,cof)
    }

    public setBallClickHandler(handler : StartClickHandler) : void{
        this.onBallClickHandler = handler;
    }

    setBallData(position : Position, radius : number = this.ballRadius, ballSpeed : number) : void{
        this.ballPosition = position;
        this.ballRadius = radius
        this.ballSpeed = ballSpeed;
    }
}