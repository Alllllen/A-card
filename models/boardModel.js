const mongoose = require('mongoose');
// const User = require('./userModel');

const boardSchema = new mongoose.Schema(
  {
    board: {
      type: String,
      unique: true,
      required: [true, 'board can not be empty!'],
    },
    discription: {
      type: String,
      default: 'This is a board about ...',
      required: [true, 'default can not be empty!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

boardSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'board',
  localField: '_id',
});

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
