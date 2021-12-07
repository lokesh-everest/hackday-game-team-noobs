import {io} from 'socket.io-client'
import {start} from "repl";
import {Color} from "../enums/color";
import {User} from "../users";

const socket = io("http://localhost:3000");

var inquirer = require('inquirer');

async function main() {
    const getName = await inquirer.prompt({
        type: "input",
        name: "name",
        message: "What is your name?",
    });

    socket.emit("join", {
        id: socket.id, name: getName.name,
        room: "test"
    });

    socket.on("roomData", (data) => {
        console.info('\x1b[31m', "Room updated. Room members are")
        console.info('\x1b[32m', data.users.map((user: User) => user.name).join("\n"))
    })

    socket.on("startGame", async (data) => {
        const input = await inquirer.prompt({
            type: "confirm",
            name: "startGame",
            message: "Do you want to start the game?",
        });
        socket.emit("playGame", input.startGame)
    })

    socket.on("broadcast", async ({type, message}) => {
        if (type == "draw") {
            const getOption = await inquirer.prompt({
                type: "confirm",
                name: "option",
                message: "Do you want to Pick the card?",
            });
            if (getOption.option == true) {
                socket.emit("drawCard", {id: socket.id})
                // socket.on("",)
            } else {
                const droppedCard = await inquirer.prompt({
                    type: "checkbox",
                    name: "option",
                    message: "Select card to drop",
                    choices: message.map((c: any) => `card-${c.digit}-${Color[c.color]}`)
                });
                socket.emit("dropCard", {id: socket.id, card: droppedCard})
            }
        }
        console.log(message);
    })
}

main()