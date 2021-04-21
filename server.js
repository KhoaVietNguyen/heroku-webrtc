const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const morgan = require('morgan')
const { v4: uuidV4 } = require('uuid')

const {ExpressPeerServer} = require('peer') 

const app = express()

const server = http.createServer(app)

const io = socketIO(server).sockets

app.use(express.json())

const peerServer = ExpressPeerServer(server,{
    debug: true,
    path: "/",
    generateClientId: uuidV4()
})

app.use("/mypeer", peerServer)

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })

io.on('connection', socket => {
    console.log("connected")
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId)
//     socket.to(roomId).broadcast.emit('user-connected', userId)

//     socket.on('disconnect', () => {
//       socket.to(roomId).broadcast.emit('user-disconnected', userId)
//     })
//   })
})
const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on port ${port}`))