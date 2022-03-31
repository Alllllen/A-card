const Post = require('./../models/postModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes

  // if (!req.body.post) req.body.post = req.params.id;
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

exports.updateLike = catchAsync(async (req, res, next) => {
  post = await Post.findById(req.body.post);
  req.body.like = post.like.slice(0);
  // console.log(req.body.like.id);
  // if (!req.body.like.includes(req.user.id)) {
  req.body.like.push(req.user.id);
  // }
  req.params.id = req.body.post;
  // req.body.like = req.user.like;
  next();
});
