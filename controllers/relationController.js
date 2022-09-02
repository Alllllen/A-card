const User = require('./../models/userModel');
const Relation = require('./../models/relationModel');
const { client, loadLuaScript, del, hgetall } = require('.././utils/redis');
const catchAsync = require('./../utils/catchAsync');

exports.agreeRelation = catchAsync(async (req, res, next) => {
  //刪除cache
  const pair = await hgetall(`user:${String(req.user._id)}:pair`);
  Promise.all([
    del(`user:${String(req.user._id)}:pair`),
    del(`user:${pair['pairUser']}:pair`),
  ]).then();
  //用lua script
  // loadLuaScript('agreeRelationLua', String(req.user._id))

  //更新DB
  const relation = await Relation.findOne({
    $and: [
      {
        $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
      },
      { isPair: true },
    ],
  });
  if (relation.relation === '0') relation.relation = '1';
  else if (relation.relation === '1') relation.relation = '2';

  relation.save();
  res.status(200).json({
    status: 'success',
  });
});
exports.disagreeRelation = catchAsync(async (req, res, next) => {
  //刪除cache
  const pair = await hgetall(`user:${String(req.user._id)}:pair`);
  Promise.all([
    del(`user:${String(req.user._id)}:pair`),
    del(`user:${pair['pairUser']}:pair`),
  ]).then();
  //更新db
  const relation = await Relation.findOne({
    $and: [
      {
        $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
      },
      { isPair: true },
    ],
  });
  relation.relation = '3';
  relation.save();
  //用lua script
  // loadLuaScript('disagreeRelationLua', String(req.user._id));
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
};
exports.makePair = catchAsync(async (req, res, next) => {
  //找出所有使用者並亂序
  const allUser = await User.find().select('_id photo name');
  randArr(allUser);
  //找出配對過且已成為朋友的組合(之後要避開)
  const isfriend = await Relation.find({ relation: { $ne: '2' } });
  let friends = new Array();
  isfriend.forEach((el) => {
    let friend = new Array();
    friend.push(el.userOne);
    friend.push(el.userTwo);
    friend.sort();
    friends.push(friend);
  });
  //配對
  while (allUser.length > 1) {
    //取兩個

    //為了排序ID
    let pairArr = new Array();
    pairArr.push(allUser[allUser.length - 2]);
    pairArr.push(allUser[allUser.length - 1]);
    pairArr.sort();
    //為了給mongodb存入
    let obj = { userOne: pairArr[0], userTwo: pairArr[1] };
    //是否是好友了?
    if (
      friends.filter((e) => JSON.stringify(e) === JSON.stringify(pairArr))
        .length > 0
    ) {
      randArr(allUser);
    } else {
      allUser.pop();
      allUser.pop();

      //put pairing status into redis and db
      await client.hmset(
        `user:${String(pairArr[0]['_id'])}:pair`,
        'pairUser',
        String(pairArr[1]['_id']),
        // 'statement',
        // 'disagree',
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
        // 'statement',
        // 'disagree',
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
  await Relation.updateMany({ relation: '2' }, { isPair: false });
  await Relation.deleteMany({ relation: { $ne: '2' } });
});
