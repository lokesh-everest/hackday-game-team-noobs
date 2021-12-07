import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import cors from 'cors'
// @ts-ignore
import {addUser, removeUser, getUser, getUsersInRoom, User} from "./users"

const path = require('path')

const PORT = process.env.PORT || 3000

const app = express()
const index = http.createServer(app)
const io = new Server(index)

app.use(cors())
io.on('connection', (socket: any) => {
    socket.on('join', (payload: any, callback: any) => {
        console.log(payload);
        // @ts-ignore
        const {error, newUser}: User | Error = addUser({
            id: socket.id,
            name: payload.name,
            room: payload.room
        })

        if (error)
            return callback(error)

        console.log(newUser);
        socket.join(newUser.room)

        io.to(newUser.room).emit('roomData', {room: newUser.room, users: getUsersInRoom(newUser.room)})
        socket.emit('currentUserData', {name: newUser.name})
        callback()
    })

    socket.on('sendMessage', (payload: any, callback: any) => {
        const user = getUser(socket.id)
        // @ts-ignore
        io.to(user.room).emit('message', {user: user.name, text: payload.message})
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user)
            io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)})
    })
})

app.get('*', (req: any, res: any) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

index.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})