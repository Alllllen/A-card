const path = require('path');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const tagRoute = require('./routes/tagRoute');
const boardRoute = require('./routes/boardRoute');
const commentRoute = require('./routes/commentRoute');
const viewRoute = require('./routes/viewRoutes');
const relationRoute = require('./routes/relationRoute');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const express = require('express');
const app = express();

// app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// implement cors
app.use(cors());
//access-controal-allow-origin
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/tags', tagRoute);
app.use('/api/v1/boards', boardRoute);
app.use('/api/v1/relations', relationRoute);
app.use(globalErrorHandler);

//shcedule
const schedule = require('node-schedule');
const relationController = require('./controllers/relationController');
let rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 15);
// pair action
let job = schedule.scheduleJob(rule, () => {
  console.log(new Date());
  relationController.clearPair();
  relationController.makePair();
});

module.exports = app;
