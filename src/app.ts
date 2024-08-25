import "../styles.css";
import { PixiApp } from "./view/PixiApp";
import { Engine } from "./engine/Engine";
import { BallGameController } from "./controllers/ballGameController";

document.addEventListener("DOMContentLoaded", async () => {
  const pixiContainer = document.getElementById("pixi-container") as HTMLElement;
  const app: PixiApp = await PixiApp.InitApp(pixiContainer);
  const engine: Engine = Engine.GetEngineInstance();
  const controller = new BallGameController(app, engine);
});
