import {Application, Assets, Container, Graphics, Sprite} from 'pixi.js';
import {Size} from "../models/Size";
import {Position} from "../models/Position";
import {EngineUpdateCallback, StartGameHandler} from "../shared/FunctionTypes";



export class PixiApp{
    private static _pixiApp : PixiApp;
    private readonly app : Application;
    private ballSprite : Sprite = new Sprite();
    private ballPosition : Position = new Position(0,0)
    private ballRadius : number = 20;
    private ballSpeed : number = 0;
    private readonly borderWidthCof : number = 0.05;
    private fieldContainer : Container<any> | undefined;

    private onBallClickHandler : StartGameHandler = (fieldSize : Size, ballPosition : Position)=>{}

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
        container.appendChild(pixiApp.app.canvas)

        await pixiApp.setField(new Position(
            container.offsetWidth * pixiApp.borderWidthCof,
            container.offsetHeight * pixiApp.borderWidthCof),
            new Size(container.offsetWidth - container.offsetWidth * pixiApp.borderWidthCof * 2,
                container.offsetHeight - container.offsetHeight * pixiApp.borderWidthCof * 2)
        );

        pixiApp.app.ticker.add(pixiApp.update.bind(pixiApp))
        return pixiApp;
    }

    async setBall(){
        const texture = await Assets.load('ball.png');
        this.ballSprite = new Sprite(texture);
        this.ballSprite.eventMode = "dynamic";
        this.ballSprite.on("pointerup", e=>this.onBallClickHandler(
            new Size(this.fieldContainer!.width, this.fieldContainer!.height),
            this.ballPosition,
            this.ballSpeed
        ))
        this.ballPosition.update(this.fieldContainer!.width / 2, this.fieldContainer!.height / 2)
        this.ballSprite.anchor.x = 0.5;
        this.ballSprite.anchor.y = 0.5;
        this.fieldContainer?.addChild(this.ballSprite)
    }
    async setField(position : Position,size : Size){
        this.fieldContainer = new Container(
            {
                position : position
            }
        );
        this.app.stage.addChild(this.fieldContainer)
        const mask = new Graphics();
        mask.rect(0, 0, size.width, size.height);
        mask.fill(0x5da9e8);
        this.fieldContainer.addChild(mask);
        await this.setBall();
    }

    update(){
            this.ballSprite.position = this.ballPosition;
            this.ballSprite.setSize({
                width: this.ballRadius * 2,
                height: this.ballRadius * 2
            })
        if(this.ballSpeed>1)
            this.ballSprite.angle += 2;
        else if(this.ballSpeed <=1 && this.ballSpeed > 0)
            this.ballSprite.angle += 0.5;
    }

    public setBallClickHandler(handler : StartGameHandler) : void{
        this.onBallClickHandler = handler;
    }

    setBallData : EngineUpdateCallback = (position : Position, radius : number = this.ballRadius, ballSpeed : number) : void => {
        this.ballPosition = position;
        this.ballRadius = radius
        this.ballSpeed = ballSpeed;
    }
}