import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import cors from 'cors'
// @ts-ignore
import {addUser, getUser, getUsersInRoom, removeUser, User} from "./users"
import Game from "./models/game";
import Player from "./models/player";
import {Color} from "./enums/color";
import {GameState} from "./enums/gameState";

const path = require('path')

const PORT = process.env.PORT || 3000

const app = express()
const index = http.createServer(app)
const io = new Server(index)

const game = new Game();


app.use(cors())
io.on('connection', (socket: any) => {
    socket.on('join', (payload: any, callback: any) => {
        // @ts-ignore
        const {error, newUser}: User | Error = addUser({
            id: socket.id,
            name: payload.name,
            room: "test"
        })

        if (error)
            return callback(error)
        socket.join("test")
        const newPlayer = new Player(payload.name, newUser.id);
        game.addPlayer(newPlayer);
        io.to("test").emit('roomData', {room: "test", users: getUsersInRoom("test")})
        if (game.players.length >= 2) {
            io.to("test").emit('startGame', {room: "test", users: getUsersInRoom("test")})
        }
        socket.emit('currentUserData', {name: newUser.name})
    })

    socket.on('playGame', (payload: any) => {
        game.startGame()
        io.to("test").emit("broadcast", {message: "Game Started!"});
        game.players.forEach(player => {
            io.to(player.socketId).emit("broadcast", {message: "Your cards are \n" + player.cards.map(c => `card-${c.digit}-${Color[c.color]}`).join("\n")})
        })
        if (game.state !== GameState.STARTED) {
            game.state = GameState.STARTED;
            gameTurn(socket, game)
        }
    })

    socket.on('sendMessage', (payload: any, callback: any) => {
        const user = getUser(socket.id)
        // @ts-ignore
        io.to("test").emit('message', {user: user.name, text: payload.message})
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    })
})

const gameTurn = (socket: any, game: Game) => {
    if (game.state !== GameState.NOT_RUNNING) {
        let currentPlayer = game.players[game.currentPlayerIndex];
        console.log("Pick card player", currentPlayer.name)
        io.to(currentPlayer.socketId).emit("broadcast", {type: "draw", message: currentPlayer.cards})
        socket.on("drawCard", (payload: any) => {
            const drawedPlayer = game.players.find((player) => player.socketId == payload.id)
            // @ts-ignore
            drawedPlayer.cards.push(game.mainDeck.pick());
            game.nextTurn();
            console.log("In game turn")
            gameTurn(socket, game)
        })
        socket.on("dropCard", (payload: any) => {
            const drawedPlayer = game.players[game.currentPlayerIndex]
            const drawedPlayerCards = drawedPlayer.cards.filter((card) => card.uuid == payload.droppedCardUUID)
            game.players[game.currentPlayerIndex].cards = drawedPlayerCards
            io.to(drawedPlayer.socketId).emit("broadcast", {message: "Your cards are \n" + drawedPlayerCards.map(c => `card-${c.digit}-${Color[c.color]}`).join("\n")})
            game.nextTurn();
            gameTurn(socket, game)
        })
    }
}

app.get('*', (req: any, res: any) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

index.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})