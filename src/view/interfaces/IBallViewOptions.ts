import { Position } from "../../models/Position";
import { Texture } from "pixi.js";

interface IBallViewOptions {
  position: Position;
  radius: number;
  speed: number;
  clickHandler(): void;
}

export interface IBallViewFactoryOptions extends IBallViewOptions {
  textureUrl: string;
}

export interface IBallViewConstructorOptions extends IBallViewOptions {
  texture: Texture;
}

export interface IBallViewUpdateOptions {
  position: Position;
  radius: number;
  speed: number;
}
