import { TextStyle, Text } from "pixi.js";
import { Colors } from "./styles/Colors";

export class Counters {
  styles: TextStyle;
  textView: Text;
  constructor(text: string, fontSize: number) {
    this.styles = new TextStyle({
      fontSize,
      fontFamily: "Arial",
      fontStyle: "normal",
      fontWeight: "normal",
      fill: Colors.Text,
      letterSpacing: 2,
      stroke: { color: "#4a1850", width: 3, join: "round" },
      wordWrap: false,
    });

    this.textView = new Text({
      text: text,
      style: this.styles,
    });
  }

  updateText(text: string) {
    this.textView.text = text;
  }
}
