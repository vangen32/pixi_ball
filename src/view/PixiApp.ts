import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
import { Size } from "../models/Size";
import { Position } from "../models/Position";
import { EngineUpdateCallback, StartGameHandler } from "../shared/SharedTypes";
import { BallView } from "./BallView";
import { Counters } from "./Counters";
import { Colors } from "./styles/Colors";

export class PixiApp {
  private static _pixiApp: PixiApp;
  private readonly app: Application;
  private readonly borderWidthCof: number = 0.05;
  private ballPosition: Position = new Position(0, 0);
  private ballRadius: number = 20;
  private ballSpeed: number = 0;
  private fieldContainer: Container<any> | undefined;
  private ball?: BallView;
  private onBallClickHandler: StartGameHandler = (fieldSize: Size, ballPosition: Position) => {};

  private countersView?: Counters;
  get counterContent() {
    return `Speed: ${this.ballSpeed.toFixed(2)}`;
  }

  private constructor() {
    this.app = new Application();
  }

  private setDebugMode() {
    if (process.env.NODE_ENV !== " production") (globalThis as any).__PIXI_APP__ = this.app;
  }

  private async createBall() {
    (this.ballPosition = new Position(this.fieldContainer!.width / 2, this.fieldContainer!.height / 2)),
      (this.ball = await BallView.GetBallInstance({
        textureUrl: "ball.png",
        position: this.ballPosition,
        speed: 0,
        radius: 20,
        clickHandler: () =>
          this.onBallClickHandler(
            new Size(this.fieldContainer!.width, this.fieldContainer!.height),
            this.ballPosition,
            this.ballSpeed
          ),
      }));
    this.fieldContainer?.addChild(this.ball!.ballSprite);
  }

  private async setField(position: Position, size: Size) {
    this.fieldContainer = new Container({
      position: position,
    });
    this.app.stage.addChild(this.fieldContainer);
    const mask = new Graphics();
    mask.rect(0, 0, size.width, size.height);
    mask.fill(Colors.Field);
    this.fieldContainer.addChild(mask);
    await this.createBall();
  }

  private createCounters() {
    this.countersView = new Counters(this.counterContent, this.app.stage.width * this.borderWidthCof - 6);

    this.countersView.textView.y = this.app.stage.height * 0.005;
    this.countersView.textView.x = this.app.stage.width * this.borderWidthCof;
    this.app.stage.addChild(this.countersView.textView);
  }

  private update() {
    this.ball?.updateBall({
      position: this.ballPosition,
      speed: this.ballSpeed,
      radius: this.ballRadius,
    });
    this.countersView?.updateText(this.counterContent);
  }

  public engineUpdateHandler: EngineUpdateCallback = (
    position: Position,
    radius: number = this.ballRadius,
    ballSpeed: number
  ): void => {
    this.ballPosition = position;
    this.ballRadius = radius;
    this.ballSpeed = ballSpeed;
  };

  public static async InitApp(container: HTMLElement): Promise<PixiApp> {
    if (PixiApp._pixiApp) return PixiApp._pixiApp;
    const pixiApp = new PixiApp();
    pixiApp.setDebugMode();
    await pixiApp.app.init({
      background: Colors.Frame,
      resizeTo: container,
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
    container.appendChild(pixiApp.app.canvas);

    await pixiApp.setField(
      new Position(container.offsetWidth * pixiApp.borderWidthCof, container.offsetHeight * pixiApp.borderWidthCof),
      new Size(
        container.offsetWidth - container.offsetWidth * pixiApp.borderWidthCof * 2,
        container.offsetHeight - container.offsetHeight * pixiApp.borderWidthCof * 2
      )
    );
    pixiApp.createCounters();
    pixiApp.app.ticker.add(pixiApp.update.bind(pixiApp));
    return pixiApp;
  }

  public setBallClickHandler(handler: StartGameHandler): void {
    this.onBallClickHandler = handler;
  }
}
