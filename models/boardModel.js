const mongoose = require('mongoose');
// const User = require('./userModel');

const boardSchema = new mongoose.Schema(
  {
    board: {
      type: String,
      required: [true, 'title can not be empty!'],
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

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
