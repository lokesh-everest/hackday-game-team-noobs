import { v4 as uuid } from 'uuid';
import Card from './card';

export default class Player {
    name: string;
    uuid: string = uuid()
    cards: Card[] = []

    constructor(name: string) {
        this.name = name;
    }
}