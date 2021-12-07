import { Color } from "./color";
import { Digit } from "./types";

export default class Card {
    digit: Digit;
    color: Color;

    constructor(digit: Digit, color: Color) {
        this.digit = digit;
        this.color = color;
    }
}