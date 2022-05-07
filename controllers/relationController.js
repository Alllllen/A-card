const User = require('./../models/userModel');
const Relation = require('./../models/relationModel');
const crud = require('./crudAction');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.agreeRelation = catchAsync(async (req, res, next) => {
  const relation = await Relation.findOne({
    $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
  });
  if (relation.relation === '0') relation.relation = '1';
  else if (relation.relation === '1') relation.isFriend = true;
  relation.save();
  res.status(200).json({
    status: 'success',
  });
});
exports.disagreeRelation = catchAsync(async (req, res, next) => {
  const relation = await Relation.findOne({
    $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
  });

  relation.relation = '3';
  relation.save();
  res.status(200).json({
    status: 'success',
  });
});

const randArr = (num, arr) => {
  for (let i = 0; i < num; i++) {
    let iRand = parseInt(num * Math.random());
    let temp = arr[i];
    arr[i] = arr[iRand];
    arr[iRand] = temp;
  }
  return arr;
};
exports.makePair = catchAsync(async (req, res, next) => {
  const user = await User.find().select('_id');
  const randUser = randArr(user.length, user);
  let users = [];
  randUser.forEach((el) => {
    users.push(el);
  });
  // const randUser = randArr(user.length, user);
  //   console.log(randRelation);
  const isfriend = await Relation.find({ isFriend: true });
  let friends = new Set();
  isfriend.forEach((el) => {
    let friend = new Set();
    friend.add(el.userOne);
    friend.add(el.userTwo);
    friends.add(friend);
  });

  while (users.length > 1) {
    let obj = new Object();
    obj.userOne = users[users.length - 2];
    obj.userTwo = users[users.length - 1];
    if (friends.has(obj)) {
      users.pop();
      users.push(obj.userTwo);
    } else {
      users.pop();
      users.pop();
      //   console.log(obj);
      const doc = await Relation.create(obj);
    }
  }
});
exports.clearPair = catchAsync(async (req, res, next) => {
  const doc = await Relation.deleteMany({ isFriend: false });
  //   next();
  //   res.status(204).json({
  //     status: 'success',
  //     data: null,
  //   });
});
