const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const Group = require('./models/groupModel')
const SocketController = require('./Controller/socketController')

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
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join_group', (data) => {
    const { name, groupName } = data;
    socket.emit('message', {
      user: 'admin',
      text: `${name} has joined to the ${groupName} room.`,
    });
    socket.broadcast.to(groupName).emit('message', {
      user: 'admin',
      text: `${name} has joined!`,
      timestamp: new Date()
    });

  });

  // socket.on('leave', (data) => {
  //   const { name, groupName } = data;
  //   socket.emit('message', {
  //     user: 'admin',
  //     text: `${name} has left from the ${groupName} room.`,
  //   });
  //   socket.broadcast.to(groupName).emit('message', {
  //     user: 'admin',
  //     text: `${name} has left.`,
  //     timestamp: new Date()
  //   });

  // });

  //fix to join after select group in left panel
  socket.on('join', async ({ name, room }, callback) => {
    const groupName = room
    // join to db
    try {
      SocketController.joinGroup(name, groupName)
      console.log(name + " join the chat")
    } catch (error) {
      console.log(error)
    }

    socket.join(groupName);

    //เด้งตอนจอยกรุ๊ปครั้งแรก
    // socket.emit('message', {
    //   user: 'admin',
    //   text: `${name} has joined to the ${groupName} room.`,
    // });
    // socket.broadcast.to(groupName).emit('message', {
    //   user: 'admin',
    //   text: `${name} has joined!`,
    // });

    const group = await Group.findOne({
      groupName,
    });

    //not used in front
    io.to(groupName).emit('roomData', {
      room: groupName,
      users: []
      // users: group.members,
    });




    socket.on('sendMessage', async (message, callback) => {
      // const user = getUser(socket.id);
      io.to(groupName).emit('message', {
        user: name,
        text: message.text,
        timestamp: message.timestamp
      });

      //save message to db
      //your code here
      try {
        SocketController.sendMessage(name, groupName, message.text, message.timestamp)
        console.log(name + " send message " + message.text)
      } catch (error) {

      }


      callback();
    });

    socket.on('disconnect', () => {
      //save to user's timestamp logout
      //your code here
      if (groupName !== "default") {
        SocketController.leaveGroup(name, groupName)
      }

      io.to(groupName).emit('roomData', {
        room: groupName,
        users: [],
      });
      console.log("disconnect")

    });


    callback();
  });




});

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}...`);
});