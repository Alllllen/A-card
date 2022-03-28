const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const tagRoute = require('./routes/tagRoute');
const commentRoute = require('./routes/commentRoute');

const globalErrorHandler = require('./controllers/errorController');

const express = require('express');
const app = express();
app.use(express.json());

app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comments', commentRoute);
// app.use('/api/v1/tags', tagRoute);

app.use(globalErrorHandler);

module.exports = app;
