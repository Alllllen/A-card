const path = require('path');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const tagRoute = require('./routes/tagRoute');
const boardRoute = require('./routes/boardRoute');
const commentRoute = require('./routes/commentRoute');
const viewRoute = require('./routes/viewRoutes');
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
// app.use(cors({ origin: 'https://www.natours.com' }));
app.options('*', cors());
// app.options('/api/v1/tours', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/api/v1/tags', tagRoute);
app.use('/api/v1/boards', boardRoute);

app.use(globalErrorHandler);

module.exports = app;
