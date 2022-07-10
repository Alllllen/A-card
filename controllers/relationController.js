const User = require('./../models/userModel');
const Relation = require('./../models/relationModel');
const { hset, hgetall } = require('.././utils/redis');
const catchAsync = require('./../utils/catchAsync');

exports.agreeRelation = catchAsync(async (req, res, next) => {
  const relation = await Relation.findOne({
    $and: [
      {
        $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
      },
      { isFriend: false },
    ],
  });
  if (relation.relation === '0') relation.relation = '1';
  else if (relation.relation === '1') {
    relation.isFriend = true;
    const pair = await hgetall(`user:${String(req.user._id)}:pair`);
    console.log('Become Friend', pair['pairUser']);
    await hset(`user:${pair['pairUser']}:pair`, 'statement', 'agree');
    await hset(`user:${String(req.user._id)}:pair`, 'statement', 'agree');
  }
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
  const user = await User.find().select('_id photo name');
  const randUser = randArr(user.length, user);
  let users = [];
  randUser.forEach((el) => {
    users.push(el);
  });
  // const randUser = randArr(user.length, user);
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
      //put pairing status into redis and db
      await hset(
        `user:${String(obj['userOne']['_id'])}:pair`,
        'pairUser',
        String(obj['userTwo']['_id'])
      );
      await hset(
        `user:${String(obj['userOne']['_id'])}:pair`,
        'statement',
        'disagree'
      );
      await hset(
        `user:${String(obj['userOne']['_id'])}:pair`,
        'photo',
        String(obj['userTwo']['photo'])
      );
      await hset(
        `user:${String(obj['userOne']['_id'])}:pair`,
        'name',
        String(obj['userTwo']['name'])
      );
      await hset(
        `user:${String(obj['userTwo']['_id'])}:pair`,
        'pairUser',
        String(obj['userOne']['_id'])
      );
      await hset(
        `user:${String(obj['userTwo']['_id'])}:pair`,
        'statement',
        'disagree'
      );
      await hset(
        `user:${String(obj['userTwo']['_id'])}:pair`,
        'photo',
        String(obj['userOne']['photo'])
      );
      await hset(
        `user:${String(obj['userTwo']['_id'])}:pair`,
        'name',
        String(obj['userOne']['name'])
      );
      const doc = await Relation.create(obj);
    }
  }
});
exports.clearPair = catchAsync(async (req, res, next) => {
  const doc = await Relation.deleteMany({ isFriend: false });
});
