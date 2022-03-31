const mongoose = require('mongoose');
const validator = require('validator');

const relationSchema = new mongoose.Schema({
  nameOne: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There is no nameOne'],
  },
  nameTwo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'There is no nameTwo'],
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
});

const relation = mongoose.model('Relation', relationSchema);
module.exports = relation;
