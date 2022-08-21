//(Chat)Redis auth socket.io
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const User = require('./models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { sadd, zadd, zrevrange, setex, incr, exists } = require('./utils/redis');

//(Chat)Redis auth socket.io
let numUsers = 0;
let user = new Array();
let user1 = '';
let user2 = '';
let connectUser = {};
let currentUser = {};

async function authentication(socket, next) {
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
  user.push(friend_id, currentUser[socket.id]._id);
  user.sort();
  user1 = user[0];
  user2 = user[1];
  user = [];

  await sadd(`user:${currentUser[socket.id]._id}:rooms`, `${user1}:${user2}`);
  let exist = await exists(`user:${currentUser[socket.id]._id}:counts`);
  if (!exist) await setex(`user:${currentUser[socket.id]._id}:counts`, 3000, 0);
  await socket.join(`${user1}:${user2}`);
  connectUser[socket.id] = `${user1}:${user2}`;
}

const message = require('./models/messageModel');
async function cacheToDb(user1, user2) {
  const mes = await zrevrange(`room:${user1}:${user2}`, 0, 50);
  mes.reverse().map(async (el) => {
    let mesDoc = {
      userOne: user1,
      userTwo: user2,
      content: el,
    };
    doc = await message.create(mesDoc);
  });
}

exports.socketAuth = async (socket, next) => {
  // Authentication
  decoded = await authentication(socket, next);
  if (!decoded) {
    return next(new AppError('Not logged in!', 401));
  }
  // // Find it's ID and Friend's ID
  currentUser[socket.id] = await User.findById(decoded.id);
  next();
};
exports.socketServer = async (io, socket) => {
  // console.log('connect', socket.id);
  //Find friend_id join room
  await findFriendAndJoinRoom(socket);
  //從redis抓出前50則信息{}
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
      let count = await incr(`user:${currentUser[socket.id]._id}:counts`);
      console.log(count);
      if (count % 50 === 0) cacheToDb(user1, user2);
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
};

//(Chat)Redis auth socket.io 舊版本
// const catchAsync = require('./utils/catchAsync');
// const AppError = require('./utils/appError');
// const User = require('./models/userModel');
// const { promisify } = require('util');
// const jwt = require('jsonwebtoken');
// const { sadd, zadd, zrevrange } = require('./utils/redis');

// async function authentication(socket, next) {
//   let CookieJwt = '';
//   if (socket.handshake.headers.cookie.includes('jwt')) {
//     CookieJwt = socket.handshake.headers.cookie.split('jwt=')[1].split(';')[0];
//   }
//   if (CookieJwt === 'nope' || CookieJwt === '') {
//     return next(new AppError('Not logged in!', 401));
//   }
//   const decoded = await promisify(jwt.verify)(
//     CookieJwt,
//     process.env.JWT_SECRET
//   );
//   return decoded;
// }
// async function findFriendAndJoinRoom(socket) {
//   const friend_id = socket.handshake.headers.referer.split('messages/')[1];
//   user.push(friend_id, currentUser[socket.id]._id);
//   user.sort();
//   user1 = user[0];
//   user2 = user[1];
//   user = [];

//   // if (parseInt(currentUser[socket.id]._id) > parseInt(friend_id)) {
//   //   user1 = currentUser[socket.id]._id;
//   //   user2 = friend_id;
//   // } else {
//   //   user1 = friend_id;
//   //   user2 = currentUser[socket.id]._id;
//   // }
//   // console.log(user1, user2);
//   await sadd(`user:${currentUser[socket.id]._id}:rooms`, `${user1}:${user2}`);
//   socket.join(`${user1}:${user2}`);
//   connectUser[socket.id] = `${user1}:${user2}`;
// }
// // socket.io
// const io = require('socket.io')(server, { cookie: true });
// let numUsers = 0;
// let user = new Array();
// let user1 = '';
// let user2 = '';
// let connectUser = {};
// let currentUser = {};
// io.use(
//   catchAsync(async (socket, next) => {
//     // Authentication
//     decoded = await authentication(socket, next);
//     if (!decoded) {
//       return next(new AppError('Not logged in!', 401));
//     }
//     // // Find it's ID and Friend's ID
//     currentUser[socket.id] = await User.findById(decoded.id);
//     next();
//   })
// ).on(
//   'connection',
//   catchAsync(async (socket) => {
//     // console.log('connect', socket.id);
//     //Find friend_id join room
//     await findFriendAndJoinRoom(socket);
//     //從redis抓出前50則信息
//     const mes = await zrevrange(`room:${user1}:${user2}`, 0, 50);
//     mes.reverse().map((x) => {
//       data = JSON.parse(x)['message'];
//       from = JSON.parse(x)['from'];
//       if (JSON.stringify(from) === JSON.stringify(currentUser[socket.id]._id)) {
//         io.to(`${socket.id}`).emit('new message', {
//           from: 'replies',
//           message: data,
//         });
//       } else {
//         io.to(`${socket.id}`).emit('new message', {
//           from: 'sent',
//           message: data,
//         });
//       }
//     });
//     let addedUser = false;
//     // when the client emits 'new message', this listens and executes
//     socket.on(
//       'new message',
//       catchAsync(async (data) => {
//         const date = Date.now();
//         await zadd(
//           `room:${connectUser[socket.id]}`,
//           '' + date,
//           JSON.stringify({
//             from: `${currentUser[socket.id]._id}`,
//             date: date,
//             message: data,
//             roomId: `${connectUser[socket.id]}`,
//           })
//         );
//         // we tell the client to execute 'new message'
//         socket.to(`${connectUser[socket.id]}`).emit('new message', {
//           from: 'sent',
//           message: data,
//         });
//       })
//     );

//     // when the client emits 'add user', this listens and executes
//     // socket.on('add user', (username) => {
//     //   if (addedUser) return;

//     //   // we store the username in the socket session for this client
//     //   socket.username = username;
//     //   ++numUsers;
//     //   addedUser = true;
//     //   socket.emit('login', {
//     //     numUsers: numUsers,
//     //   });
//     //   // echo globally (all clients) that a person has connected
//     //   socket.broadcast.emit('user joined', {
//     //     username: socket.username,
//     //     numUsers: numUsers,
//     //   });
//     // });

//     // when the client emits 'typing', we broadcast it to others
//     socket.on('typing', () => {
//       socket.to(`${connectUser[socket.id]}`).emit('typing', {
//         username: socket.username,
//       });
//     });

//     // when the client emits 'stop typing', we broadcast it to others
//     socket.on('stop typing', () => {
//       // console.log('stop typeing');
//       socket.broadcast.emit('stop typing', {
//         username: socket.username,
//       });
//     });

//     // when the user disconnects.. perform this
//     socket.on('disconnect', () => {
//       if (addedUser) {
//         --numUsers;

//         // echo globally that this client has left
//         socket.broadcast.emit('user left', {
//           username: socket.username,
//           numUsers: numUsers,
//         });
//       }
//     });
//   })
// );
