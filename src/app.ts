import "../styles.css";
import { PixiApp } from "./view/PixiApp";
import { Engine } from "./engine/Engine";
import { BallGameController } from "./controllers/ballGameController";

document.addEventListener("DOMContentLoaded", async () => {
  const pixiContainer = document.getElementById("pixi-container") as HTMLElement;
  const engine: Engine = Engine.GetEngineInstance();
  const app: PixiApp = await PixiApp.InitApp(pixiContainer);
  const controller = new BallGameController(app, engine);

  window.onresize = (e) => {
    controller.updateValues();
    app.onWindowsResize(pixiContainer);
  };
});
