import { shuffleCards } from "../utils/shuffle";
import Card from "./card";

export default class Deck {
    cards: Array<Card>;

    constructor(cards: Array<Card> = []) {
        this.cards = cards;
    }

    add(card: Card) {
        this.cards.push(card);
    }

    pick(): Card | undefined {
        return this.cards.pop();
    }

    set(cards: Array<Card>) {
        this.cards = cards;
    }

    shuffle() {
        shuffleCards(this.cards);
    }
}