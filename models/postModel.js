const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');
// const User = require('./userModel');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title can not be empty!'],
    },
    content: {
      type: String,
      required: [true, 'content can not be empty!'],
    },
    likeNum: {
      type: Number,
      default: 0,
    },
    like: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        // unique: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
    board: {
      type: mongoose.Schema.ObjectId,
      ref: 'Board',
      required: [true, 'Post must belong to a Board'],
    },
    tag: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tag',
      },
    ],
    images: [String],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.plugin(arrayUniquePlugin);

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

// postSchema.pre('save', function (next) {
//   this.like = _.uniq(this.like);
//   next();
// });

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'board',
    select: 'board',
  });

  this.populate({
    path: 'tag',
    select: 'tag',
  });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

postSchema.pre(/findOne/, function (next) {
  this.populate({
    path: 'comments',
  });

  next();
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
