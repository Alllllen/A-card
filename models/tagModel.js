const mongoose = require('mongoose');
// const User = require('./userModel');

const tagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: [true, 'title can not be empty!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tagSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'tag',
  localField: '_id',
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
