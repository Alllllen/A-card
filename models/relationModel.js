const mongoose = require('mongoose');
const validator = require('validator');

const relationSchema = new mongoose.Schema({
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
  relation: {
    type: String,
    enum: [
      '0', // no one response
      '1', // one accept
      '2', // both accept
      '3', // reject
    ],
    default: '0',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPair: { type: Boolean, default: true }, // 是否是本輪的配對
});

relationSchema.pre(/^find/, function (next) {
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

const relation = mongoose.model('Relation', relationSchema);
module.exports = relation;
