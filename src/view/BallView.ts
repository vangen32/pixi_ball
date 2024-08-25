import { Assets, Sprite, Texture } from "pixi.js";
import {
  IBallViewConstructorOptions,
  IBallViewFactoryOptions,
  IBallViewUpdateOptions,
} from "./interfaces/IBallViewOptions";

export class BallView {
  private _ballSprite: Sprite = new Sprite();
  get ballSprite(): Sprite {
    return this._ballSprite;
  }
  private ballSpeed: number = 0;

  private constructor(options: IBallViewConstructorOptions) {
    this._ballSprite = new Sprite(options.texture);
    this._ballSprite.eventMode = "dynamic";
    this._ballSprite.on("pointerup", (e) => options.clickHandler());
    this._ballSprite.anchor.x = 0.5;
    this._ballSprite.anchor.y = 0.5;
    const { position, radius, speed } = options;
    this.updateBall({ position, radius, speed });
  }

  public updateBall(options: IBallViewUpdateOptions) {
    this.ballSpeed = options.speed;
    this._ballSprite.position = options.position;
    this.ballSprite.setSize({
      width: options.radius * 2,
      height: options.radius * 2,
    });
    if (this.ballSpeed > 1) this.ballSprite.angle += 2;
    else if (this.ballSpeed <= 1 && this.ballSpeed > 0) this.ballSprite.angle += 0.5;
  }

  public static async GetBallInstance(options: IBallViewFactoryOptions): Promise<BallView> {
    const texture = (await Assets.load(options.textureUrl)) as Texture;
    const { textureUrl, ...rest } = options;
    return new BallView({
      texture: texture,
      ...rest,
    });
  }
}
