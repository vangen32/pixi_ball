import { Size } from "../models/Size";
import { Position } from "../models/Position";

export type StartGameHandler = (fieldSize: Size, ballPosition: Position, ballSpeed: number) => void;
export type EngineUpdateCallback = (ballPosition: Position, ballRadius: number, speed: number) => void;
