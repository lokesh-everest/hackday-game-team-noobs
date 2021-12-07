type User = {
    id: string,
    name: string,
    room: string
}

type NewUser = {
    newUser: User
}

type Error = {
    error?: string
}

const users: User[] = []

const addUser = ({id, name, room}: User): NewUser | Error => {
    const newUser = {id, name, room}
    users.push(newUser)
    return {newUser}
}

const removeUser = (id: String) => {
    const removeIndex = users.findIndex(user => user.id === id)

    if (removeIndex !== -1)
        return users.splice(removeIndex, 1)[0]
}

const getUser = (id: String): User | undefined => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room: String): User[] => {
    return users.filter(user => user.room === room)
}

export {addUser, removeUser, getUser, getUsersInRoom, User}