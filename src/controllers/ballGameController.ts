import { PixiApp } from "../view/PixiApp";
import { Engine } from "../engine/Engine";

export class BallGameController {
  constructor(
    private view: PixiApp,
    private engine: Engine
  ) {
    this.configDependencies();
  }

  private configDependencies() {
    this.engine.setEngineUpdateCallBack(this.view.engineUpdateHandler.bind(this.view));
    this.view.setBallClickHandler(this.engine.startGame.bind(this.engine));
  }
}
