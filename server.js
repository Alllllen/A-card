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
