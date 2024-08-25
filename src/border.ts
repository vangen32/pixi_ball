import { Container, Graphics } from "pixi.js";
import { ContainerChild } from "pixi.js/lib/scene/container/Container";
import { Size } from "./models/Size";

export class Border extends Graphics {
  private constructor() {
    super();
  }

  /**
   * @param borderWidthCof - Between 0 and 0.5 inclusive. For calculate the frame width based on the targetContainer width
   */
  public static CreateBorder(targetContainer: ContainerChild, size: Size, borderWidthCof: number): Border {
    const borderWidth = borderWidthCof < 0 || borderWidthCof > 0.5 ? 0.02 : targetContainer.width * borderWidthCof;
    const border: Border = new Border();
    border.rect(0, 0, size.width, size.height);
    border.stroke({
      color: "green",
      width: borderWidth,
    });
    targetContainer.addChild(border);
    return border;
  }
}
