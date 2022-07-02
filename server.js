const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

//DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('DB connect success'))
  .catch((err) => {
    console.log(err.message);
  });
const port = process.env.PORT || 8080;

// server;
const server = app.listen(port, () => {
  console.log(`Server Run on port ${port}`);
});

//(Chat)Redis auth socket.io
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const User = require('./models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { exists, set, get, sadd, zadd, zrevrange } = require('./utils/redis');

async function authentication(socket) {
  let CookieJwt = '';
  if (socket.handshake.headers.cookie.includes('jwt')) {
    CookieJwt = socket.handshake.headers.cookie.split('jwt=')[1].split(';')[0];
  }
  if (CookieJwt === 'nope' || CookieJwt === '') {
    return next(new AppError('Not logged in!', 401));
  }
  const decoded = await promisify(jwt.verify)(
    CookieJwt,
    process.env.JWT_SECRET
  );
  return decoded;
}
async function findFriendAndJoinRoom(socket) {
  const friend_id = socket.handshake.headers.referer.split('messages/')[1];
  if (parseInt(currentUser[socket.id]._id) > parseInt(friend_id)) {
    user1 = currentUser[socket.id]._id;
    user2 = friend_id;
  } else {
    user1 = friend_id;
    user2 = currentUser[socket.id]._id;
  }
  await sadd(`user:${currentUser[socket.id]._id}:rooms`, `${user1}:${user2}`);
  socket.join(`${user1}:${user2}`);
  connectUser[socket.id] = `${user1}:${user2}`;
}
// socket.io
const io = require('socket.io')(server, { cookie: true });
let numUsers = 0;
let user1 = '';
let user2 = '';
let connectUser = {};
let currentUser = {};
io.use(
  catchAsync(async (socket, next) => {
    // Authentication
    decoded = await authentication(socket);
    // // Find it's ID and Friend's ID
    currentUser[socket.id] = await User.findById(decoded.id);
    next();
  })
).on(
  'connection',
  catchAsync(async (socket) => {
    // console.log('connect', socket.id);
    //Find friend_id join room
    await findFriendAndJoinRoom(socket);
    //從redis抓出前50則信息
    const mes = await zrevrange(`room:${user1}:${user2}`, 0, 50);
    mes.reverse().map((x) => {
      data = JSON.parse(x)['message'];
      from = JSON.parse(x)['from'];
      if (JSON.stringify(from) === JSON.stringify(currentUser[socket.id]._id)) {
        io.to(`${socket.id}`).emit('new message', {
          from: 'replies',
          message: data,
        });
      } else {
        io.to(`${socket.id}`).emit('new message', {
          from: 'sent',
          message: data,
        });
      }
    });
    let addedUser = false;
    // when the client emits 'new message', this listens and executes
    socket.on(
      'new message',
      catchAsync(async (data) => {
        const date = Date.now();
        await zadd(
          `room:${connectUser[socket.id]}`,
          '' + date,
          JSON.stringify({
            from: `${currentUser[socket.id]._id}`,
            date: date,
            message: data,
            roomId: `${connectUser[socket.id]}`,
          })
        );
        // we tell the client to execute 'new message'
        socket.to(`${connectUser[socket.id]}`).emit('new message', {
          from: 'sent',
          message: data,
        });
      })
    );

    // when the client emits 'add user', this listens and executes
    // socket.on('add user', (username) => {
    //   if (addedUser) return;

    //   // we store the username in the socket session for this client
    //   socket.username = username;
    //   ++numUsers;
    //   addedUser = true;
    //   socket.emit('login', {
    //     numUsers: numUsers,
    //   });
    //   // echo globally (all clients) that a person has connected
    //   socket.broadcast.emit('user joined', {
    //     username: socket.username,
    //     numUsers: numUsers,
    //   });
    // });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
      socket.to(`${connectUser[socket.id]}`).emit('typing', {
        username: socket.username,
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
      // console.log('stop typeing');
      socket.broadcast.emit('stop typing', {
        username: socket.username,
      });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers,
        });
      }
    });
  })
);
