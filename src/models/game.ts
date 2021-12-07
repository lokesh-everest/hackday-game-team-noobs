import { cards } from "../data/cards";
import Card from "./card";
import Deck from "./deck";
import { GameState } from "../enums/gameState";
import Player from "./player";

export default class Game {
    players: Array<Player> = [];
    mainDeck: Deck = new Deck();
    discardDeck = new Deck();
    state: GameState = GameState.NOT_RUNNING;

    constructor() {
        this.initMainDeck();
    }

    runGame() {
        this.state = GameState.RUNNING;
    }

    stopGame() {
        this.state = GameState.NOT_RUNNING;
    }

    initMainDeck() {
        const allCards = cards as Array<Card>;
        this.mainDeck.set(allCards);
        this.mainDeck.shuffle();
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1 )this.players.splice(playerIndex);
    }
}