const path = require('path');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const tagRoute = require('./routes/tagRoute');
const boardRoute = require('./routes/boardRoute');
const commentRoute = require('./routes/commentRoute');
const viewRoute = require('./routes/viewRoutes');
const relationRoute = require('./routes/relationRoute');
const globalErrorHandler = require('./controllers/errorController');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const express = require('express');
const app = express();

// const apicache = require('apicache');
// const cache = apicache.middleware;
// app.use(cache('5 minutes'));

// app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// implement cors
app.use(cors());
//access-controal-allow-origin *
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

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

module.exports = app;
