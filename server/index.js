const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { addUser, removeUser, getUserById, getRoomUsers } = require('./user');

const port = 3070;
const app = express();

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin to access the server
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));

const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

httpServer.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('join', ({ name, room }, callback) => {
        console.log('join request -->', name);

        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit("message", {
            user: "System",
            text: `Welcome ${name} to  ${room}.`,
        });

        socket.broadcast.to(room).emit("message", {
            user: "System",
            text: `${name} just joined  ${room}.`,
        });

        const roomUsers = getRoomUsers(room);
        io.to(room).emit("userList", { roomUsers });

        callback();
    });

    // socket.on("message", (message) => {
    //     console.log("message =>", message);
    // })

    socket.on("message", (message) => {
        const user = getUserById(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        // const user = getUserById(socket.id);
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", {
                user: "System",
                text: `${user.name} just left  ${user.room}.`,
            });
            const roomUsers = getRoomUsers(room);
            io.to(user.room).emit("userList", { roomUsers });

        }

    });
});