const mongoose = require('mongoose');
// const User = require('./userModel');

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, 'title can not be empty!'],
    },
    // post: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Post',
    //   // required: [true, 'Tag must belong to a user'],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
