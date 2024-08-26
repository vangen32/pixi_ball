import { PixiApp } from "../view/PixiApp";
import { Engine } from "../engine/Engine";

export class BallGameController {
  constructor(
    private _view: PixiApp,
    private _engine: Engine
  ) {
    this.updateValues();
    this.configDependencies();
  }

  public updateValues(){
    this._engine.fieldSize = this._view.fieldSize;
    this._view.ballRadius = this._engine.ballRadius;
  }

  private configDependencies() {
    this._engine.setEngineUpdateCallBack(this._view.engineUpdateHandler.bind(this._view));
    this._view.setBallClickHandler(this._engine.startGame.bind(this._engine));
  }
}
