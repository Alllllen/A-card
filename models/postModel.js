const mongoose = require('mongoose');
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
    like: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must belong to a user'],
    },
    // board: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Board',
    //   // required: [true, 'Post must belong to a Board'],
    // },
    // tag: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Tag',
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
