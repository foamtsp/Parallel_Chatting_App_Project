const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const MONGODB_URI =
  'mongodb+srv://admin:admin@cluster0-huryl.mongodb.net/test?retryWrites=true&w=majority';

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error', err);
});

const io = socketio(server);

app.use(cors());
app.use(router);

//function join group
//add user to group in db

//create group

//function leave group
//delete user from group in db

io.on('connect', (socket) => {
  //fix to join after select group in left panel
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    //get unread message if user existed

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name} has joined to the ${user.room} room.`,
    });
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    //save message to db
    //your code here

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    //save to user's timestamp logout
    //your code here

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(process.env.PORT || 4000, () =>
  console.log(`Server has started. on PORT 4000`)
);
