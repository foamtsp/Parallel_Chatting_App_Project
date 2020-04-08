const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

dotenv.config({
  path: './config.env',
});

const SERVER_PORT = process.env.PORT || 6000;
const MONGODB_URI = process.env.DATABASE;
const MONGODB_OPTIONS = {
  dbName: 'Chat-app',
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

// Connect to mongoDB
mongoose
  .connect(MONGODB_URI, MONGODB_OPTIONS)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    throw new Error(err.message);
  });
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error: ', err);
});

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser and limits size
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(cors());
app.use('/api', router);

// Listen on every connection
// io.on('connection', (socket) => {
//   console.log('New user connected');

//   socket.on('join_group', (data) => {
//     const { userName, groupName } = data;

//   });

//   //fix to join after select group in left panel
//   socket.on('join', ({ name, room }, callback) => {
//     const { error, user } = addUser({
//       id: socket.id,
//       name,
//       room,
//     });

//     //get unread message if user existed

//     if (error) return callback(error);

//     socket.join(user.room);

//     socket.emit('message', {
//       user: 'admin',
//       text: `${user.name} has joined to the ${user.room} room.`,
//     });
//     socket.broadcast.to(user.room).emit('message', {
//       user: 'admin',
//       text: `${user.name} has joined!`,
//     });

//     io.to(user.room).emit('roomData', {
//       room: user.room,
//       users: getUsersInRoom(user.room),
//     });

//     callback();
//   });

//   socket.on('sendMessage', (message, callback) => {
//     const user = getUser(socket.id);

//     io.to(user.room).emit('message', {
//       user: user.name,
//       text: message,
//     });

//     //save message to db
//     //your code here

//     callback();
//   });

//   socket.on('disconnect', () => {
//     const user = removeUser(socket.id);

//     //save to user's timestamp logout
//     //your code here

//     if (user) {
//       io.to(user.room).emit('message', {
//         user: 'Admin',
//         text: `${user.name} has left.`,
//       });
//       io.to(user.room).emit('roomData', {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });
//     }
//   });
// });

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}...`);
});