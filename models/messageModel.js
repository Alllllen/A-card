const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema({
  userOne: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There is no userOne'],
  },
  userTwo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There is no userTwo'],
  },
  content: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userOne',
    select: 'name photo',
  });
  this.populate({
    path: 'userTwo',
    select: 'name photo',
  });
  next();
});

const message = mongoose.model('Message', messageSchema);
module.exports = message;
