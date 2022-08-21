const User = require('./../models/userModel');
const Relation = require('./../models/relationModel');
const { client, loadLuaScript } = require('.././utils/redis');
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
  loadLuaScript('agreeRelationLua', String(req.user._id)); //用lua script
  if (relation.relation === '0') relation.relation = '1';
  else if (relation.relation === '1') {
    relation.isFriend = true;
    // const pair = await hgetall(`user:${String(req.user._id)}:pair`);
    // console.log('Become Friend', pair['pairUser']);
    // await hset(`user:${pair['pairUser']}:pair`, 'statement', 'agree');
    // await hset(`user:${String(req.user._id)}:pair`, 'statement', 'agree');
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
  loadLuaScript('disagreeRelationLua', String(req.user._id)); //用lua script
  res.status(200).json({
    status: 'success',
  });
});
const randArr = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let iRand = parseInt(arr.length * Math.random());
    let temp = arr[i];
    arr[i] = arr[iRand];
    arr[iRand] = temp;
  }
  return arr;
};
exports.makePair = catchAsync(async (req, res, next) => {
  //找出所有使用者並亂序
  const allUser = await User.find().select('_id photo name');
  const allUserRand = randArr(allUser);

  //找出配對過且已成為朋友的組合(之後要避開)
  const isfriend = await Relation.find({ isFriend: true });
  let friends = new Set();
  isfriend.forEach((el) => {
    let friend = new Set();
    friend.add(el.userOne);
    friend.add(el.userTwo);
    friends.add(friend);
  });
  //配對
  while (allUserRand.length > 1) {
    //取兩個
    let pair = new Set();
    pair.add(allUserRand[allUserRand.length - 2]);
    pair.add(allUserRand[allUserRand.length - 1]);
    //為了排序ID
    let pairArr = Array.from(pair);
    pairArr.sort();
    //為了給mongodb存入
    let obj = { userOne: pairArr[0], userTwo: pairArr[1] };
    //是否是好友了?:
    if (friends.has(pair)) {
      allUserRand = randArr(allUserRand);
    } else {
      allUserRand.pop();
      allUserRand.pop();

      //put pairing status into redis and db
      await client.hmset(
        `user:${String(pairArr[0]['_id'])}:pair`,
        'pairUser',
        String(pairArr[1]['_id']),
        'statement',
        'disagree',
        'photo',
        String(pairArr[1]['photo']),
        'name',
        String(pairArr[1]['name']),
        'status',
        '0'
      );
      await client.hmset(
        `user:${String(pairArr[1]['_id'])}:pair`,
        'pairUser',
        String(pairArr[0]['_id']),
        'statement',
        'disagree',
        'photo',
        String(pairArr[0]['photo']),
        'name',
        String(pairArr[0]['name']),
        'status',
        '0'
      );
      // await set(`pair:${pairArr[0]['_id']}:${pairArr[1]['_id']}`, '0');
      await Relation.create(obj);
    }
  }
});
exports.clearPair = catchAsync(async (req, res, next) => {
  const doc = await Relation.deleteMany({ isFriend: false });
  // client.fl;
});
