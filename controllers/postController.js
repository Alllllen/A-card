const Post = require('./../models/postModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tagId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.getAllPosts = crud.getAll(Post, {
  path: 'comments',
  select: 'content like user createdAt',
});
exports.createPost = crud.createOne(Post);
exports.updatePost = crud.updateOne(Post);
exports.deletePost = crud.deleteOne(Post);
exports.getPost = crud.getOne(Post, {
  path: 'comments',
  select: 'content like user createdAt',
});
