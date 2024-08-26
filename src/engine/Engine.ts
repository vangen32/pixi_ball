import { Size } from "../models/Size";
import { Position } from "../models/Position";
import { EngineUpdateCallback, StartGameHandler } from "../shared/SharedTypes";

export class Engine {
  private static engine: Engine;
  private _fieldSize: Size = new Size(0, 0);
  private _intervalId: NodeJS.Timeout | undefined;
  private _speed: number = 0;
  private _velocity: { x: number; y: number } = { x: 0, y: 0 };
  private _ballPosition: Position = new Position(0, 0);
  private onUpdateHandler: EngineUpdateCallback = (ballPosition, ballRadius, speed) => {};

  private constructor() {}

  set fieldSize(size: Size) {
    this._fieldSize = size;
  }

  get ballRadius() {
    return this._fieldSize.width * 0.03;
  }

  private initGame(fieldSize: Size, ballPosition: Position) {
    clearInterval(this._intervalId);
    const angle = Math.random() * 2 * Math.PI;
    this._speed = Math.random() * 25;
    this._velocity.x = Math.cos(angle) * this._speed;
    this._velocity.y = Math.sin(angle) * this._speed;
    this._fieldSize = fieldSize;
    this._ballPosition = ballPosition;
  }

  private update() {
    this._ballPosition.update(this._ballPosition.x + this._velocity.x, this._ballPosition.y + this._velocity.y);
    this._speed *= 0.99;
    if (this._speed < 0.1) {
      this._speed = 0;
      clearInterval(this._intervalId);
    }
    this._velocity.x = Math.cos(Math.atan2(this._velocity.y, this._velocity.x)) * this._speed;
    this._velocity.y = Math.sin(Math.atan2(this._velocity.y, this._velocity.x)) * this._speed;

    if (
      this._ballPosition.x - this.ballRadius <= 0 ||
      this._ballPosition.x + this.ballRadius >= this._fieldSize.width
    ) {
      this._velocity.x *= -1;
      const x = Math.max(this.ballRadius, Math.min(this._ballPosition.x, this._fieldSize.width - this.ballRadius));
      this._ballPosition.update(x, this._ballPosition.y);
    }

    if (
      this._ballPosition.y - this.ballRadius <= 0 ||
      this._ballPosition.y + this.ballRadius >= this._fieldSize.height
    ) {
      this._velocity.y *= -1;
      const y = Math.max(this.ballRadius, Math.min(this._ballPosition.y, this._fieldSize.height - this.ballRadius));
      this._ballPosition.update(this._ballPosition.x, y);
    }
    this.onUpdateHandler(this._ballPosition, this.ballRadius, this._speed);
  }

  public static GetEngineInstance() {
    if (!Engine.engine) Engine.engine = new Engine();
    return this.engine;
  }

  public startGame: StartGameHandler = (fieldSize: Size, ballPosition: Position): void => {
    this.initGame(fieldSize, ballPosition);
    this._intervalId = setInterval(this.update.bind(this), 15);
  };

  public setEngineUpdateCallBack(callback: EngineUpdateCallback) {
    this.onUpdateHandler = callback;
  }
}
