const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>WEBRTC DEMO SERVER</h1>');
});

app.use(express.json())

const server = http.createServer(app);

const io = socketIO(server).sockets;

//** Peer Server */
const customGenerationFunction = () =>
  (Math.random().toString(36) + "0000000000000000000").substr(2, 16);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
  generateClientId: customGenerationFunction,
});

app.use("/mypeer", peerServer );

io.on("connection", socket => {
  socket.on('join-room', ({ peerID, roomID }) => {
    console.log("peerID", peerID)
    app.get('/', (req, res) => {
        res.send(`<h1>${peerID}</h1>`);
      });
    socket.join(roomID)
    socket.to(roomID).broadcast.emit('user-connected', { peerID })
  })

});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
