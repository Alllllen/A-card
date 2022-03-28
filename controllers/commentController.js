const Comment = require('./../models/commentModel');
const AppError = require('./../utils/appError');
const crud = require('./crudAction');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createComment = crud.createOne(Comment);
exports.updateComment = crud.updateOne(Comment);
exports.deleteComment = crud.deleteOne(Comment);
exports.getComment = crud.getOne(Comment, { path: 'comments' });
exports.createComment = crud.createOne(Comment);
