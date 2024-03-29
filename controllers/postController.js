const Post = require('./../models/postModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { del } = require('.././utils/redis');

const multer = require('multer');
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Please upload only image', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPostImages = upload.fields([{ name: 'images', maxCount: 3 }]);

exports.setUserIds = (req, res, next) => {
  // Allow nested routes

  // if (!req.body.post) req.body.post = req.params.id;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.updateLike = catchAsync(async (req, res, next) => {
  post = await Post.findById(req.body.post);
  req.body.like = post.like.slice(0);
  if (
    req.body.like.filter(
      (e) => JSON.stringify(e) === JSON.stringify(req.user._id)
    ).length > 0
  )
    return next(new AppError('Already thump up', 400));
  req.body.like.push(req.user.id);
  req.body.likeNum = post.likeNum + 1;
  req.params.id = req.body.post;
  next();
});

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
