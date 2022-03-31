const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'There is no name'], unique: true },
  email: {
    type: String,
    required: [true, 'There is no email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, ' Enter valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'There is no password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'There is no password comfirm'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: `Password not equal passwordConfirm`,
    },
  },
});

// Virtual populate
userSchema.virtual('relations', {
  ref: 'Relation',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model('User', userSchema);
module.exports = user;
