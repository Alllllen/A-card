const Tag = require('./../models/tagModel');
const AppError = require('./../utils/appError');

exports.getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return next(new AppError('There is no post in this tag', 400));
    }
    res.status(200).json({ status: 'success', tag });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

exports.createTag = async (req, res, next) => {
  try {
    console.log(req.user._id);
    req.body.user = req.user._id;
    const newPost = await Post.create(req.body);
    res.status(200).json({ status: 'success', newPost });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
