const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { socketAuth, socketServer } = require('./messageServer');
const schedule = require('./utils/schedule');
const catchAsync = require('./utils/catchAsync');
dotenv.config({ path: './config.env' });

//DB
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log(err.message);
  });
const port = process.env.PORT || 8080;

// server;
const server = app.listen(port, () => {
  console.log(`Server Run on port ${port}`);
});

//message Server
const io = require('socket.io')(server, { cookie: true });
io.use(
  catchAsync(async (socket, next) => {
    socketAuth(socket, next);
  })
).on(
  'connection',
  catchAsync(async (socket) => {
    socketServer(io, socket);
  })
);

//shcedule
schedule.makePair();
const relationController = require('./controllers/relationController');
// relationController.clearPair();
// relationController.makePair();

// const post = require('./models/postModel');
// function getRandomArbitrary(min, max) {
//   return Math.random() * (max - min) + min;
// }
// for (let i = 0; i < 13; i++) {
//   let like = parseInt(getRandomArbitrary(0, 5000));
//   let rand = getRandomArbitrary(0, 16615005002);
//   let time = parseInt(Date.now() - rand);
//   // console.log(time);
//   post.create({
//     title: `post - ${i}`,
//     content: `content - ${i}`,
//     user: '62403eb8a17497624c31a6c6',
//     board: '62429f46f73709769d33b31c',
//     tag: ['6241a929ee80052724ffd894', '6241a924ee80052724ffd891'],
//     likeNum: like,
//     createdAt: time,
//   });
// }
