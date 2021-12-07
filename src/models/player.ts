import Card from './card';

export default class Player {
    name: string;
    socketId: string;
    cards: Card[] = []

    constructor(name: string,socketId:string) {
        this.name = name;
        this.socketId = socketId
    }
}