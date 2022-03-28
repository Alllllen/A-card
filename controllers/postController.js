const Post = require('./../models/postModel');
const crud = require('./crudAction');
const AppError = require('./../utils/appError');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  // if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllPosts = crud.getAll(Post, {
  path: 'comments',
  select: 'content like user createdAt',
});
exports.createPost = crud.createOne(Post);
