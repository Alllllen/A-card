const Comment = require('./../models/commentModel');
const AppError = require('./../utils/appError');
const crud = require('./crudAction');

exports.setUserIds = (req, res, next) => {
  // Allow nested routes
  // if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createComment = crud(Comment);
