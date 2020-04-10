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
const Message = require('./models/messageModel')
const User = require('./models/userModel')
const UserRecord = require('./models/userRecordModel')
const GroupController = require('./Controller/groupController')
const UserController = require('./Controller/userController')

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
    const { userName, groupName } = data;

  });

  //fix to join after select group in left panel
  socket.on('join', async ({ name, room }, callback) => {
    // const { error, user } = addUser({
    //   id: socket.id,
    //   name,
    //   room,
    // });

    // join to db
    const groupName = room;
    const group = await Group.findOne({
      groupName,
    });

    const user = await User.findOneAndUpdate({
      name,
    }, {
      currentGroup: group._id
    }, {
      new: true,
      runValidators: true
    });

    await Group.findOneAndUpdate({
      groupName,
    }, {
      $addToSet: {
        members: user._id
      }
    });

    //get unread message if user existed

    // if (error) return callback(error);

    socket.join(groupName);

    socket.emit('message', {
      user: 'admin',
      text: `${name} has joined to the ${groupName} room.`,
    });
    socket.broadcast.to(groupName).emit('message', {
      user: 'admin',
      text: `${name} has joined!`,
    });

    io.to(groupName).emit('roomData', {
      room: groupName,
      users: group.members,
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
      let newMessage = await Message.create({
        author: user.name,
        group: group._id,
        text: message.text,
      });

      // Add message id to user
      await User.findByIdAndUpdate({
        _id: user._id,
        currentGroup: groupName
      }, {
        $push: {
          messages: newMessage._id
        }
      });

      // Add message id to the group
      await Group.findOneAndUpdate({
        groupName,
      }, {
        $push: {
          messages: newMessage._id,
        },
      });

      newMessage = await newMessage.populate({
        path: 'group',
        select: 'groupName'
      }).execPopulate();

      callback();
    });

    callback();
  });


  // socket.on('disconnect', () => {
  //   const user = removeUser(socket.id);

  //   //save to user's timestamp logout
  //   //your code here

  //   if (user) {
  //     io.to(user.room).emit('message', {
  //       user: 'Admin',
  //       text: `${user.name} has left.`,
  //     });
  //     io.to(user.room).emit('roomData', {
  //       room: user.room,
  //       users: getUsersInRoom(user.room),
  //     });
  //   }
  // });
});

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}...`);
});