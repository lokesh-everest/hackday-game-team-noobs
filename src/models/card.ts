import {Color} from "../enums/color";
import {Digit} from "./types";
import {v4 as uuid} from 'uuid';

export default class Card {
    digit: Digit;
    color: Color;
    uuid = uuid()

    constructor(digit: Digit, color: Color) {
        this.digit = digit;
        this.color = color;
    }
}