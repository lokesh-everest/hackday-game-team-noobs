import {cards} from "../data/cards";
import Card from "./card";
import Deck from "./deck";
import {GameState} from "../enums/gameState";
import Player from "./player";

export default class Game {
    players: Array<Player> = [];
    mainDeck: Deck = new Deck();
    currentPlayerIndex: number = 0;
    discardDeck = new Deck();
    state: GameState = GameState.NOT_RUNNING;

    constructor() {
        this.initMainDeck();
    }

    nextTurn() {
        this.currentPlayerIndex++;
        this.currentPlayerIndex = this.currentPlayerIndex % this.players.length;
    }

    startGame() {
        this.state = GameState.RUNNING;
        this.getInitialCards();
    }

    stopGame() {
        this.state = GameState.NOT_RUNNING;
    }

    initMainDeck() {
        const allCards = cards as Array<Card>;
        this.mainDeck.set(allCards);
        this.mainDeck.shuffle();
    }

    getInitialCards() {
        this.players.forEach(player => {
            for (let i = 0; i < 7; i++) {
                // @ts-ignore
                player.cards.push(this.mainDeck.pick())
            }
        })
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        const playerIndex = this.players.indexOf(player);
        if (playerIndex !== -1) this.players.splice(playerIndex);
    }
}