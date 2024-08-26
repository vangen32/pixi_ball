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
  private _ballRadius: number = 20;
  private ballSpeed: number = 0;
  private fieldContainer: Container<any> | undefined;
  private ball?: BallView;
  private onBallClickHandler: StartGameHandler = (fieldSize: Size, ballPosition: Position) => {};
  private countersView?: Counters;

  get counterContent() {
    return `Speed: ${this.ballSpeed.toFixed(2)}`;
  }
  get fieldSize(): Size {
    return new Size(this.fieldContainer?.width ?? 0, this.fieldContainer?.height ?? 0);
  }

  set ballRadius(radius: number) {
    this._ballRadius = radius;
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

  private async createField(position: Position, size: Size) {
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
      radius: this._ballRadius,
    });
    this.countersView?.updateText(this.counterContent);
  }

  public engineUpdateHandler: EngineUpdateCallback = (
    position: Position,
    radius: number = this._ballRadius,
    ballSpeed: number
  ): void => {
    this.ballPosition = position;
    this._ballRadius = radius;
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

    await pixiApp.createField(
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

  public async onWindowsResize(pixiAppContainer: HTMLElement) {
    this.fieldContainer?.destroy();
    this.countersView?.textView.destroy();
    await this.createField(
      new Position(
        pixiAppContainer.offsetWidth * this.borderWidthCof,
        pixiAppContainer.offsetHeight * this.borderWidthCof
      ),
      new Size(
        pixiAppContainer.offsetWidth - pixiAppContainer.offsetWidth * this.borderWidthCof * 2,
        pixiAppContainer.offsetHeight - pixiAppContainer.offsetHeight * this.borderWidthCof * 2
      )
    );

    this.createCounters();
  }
}
