const Post = require('../models/postModel');
const Board = require('../models/boardModel');
const Relation = require('../models/relationModel');
const catchAsync = require('../utils/catchAsync');
const { hgetall, setex, get, exists, client } = require('.././utils/redis');

const getOrSetCache = (key, cb) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await get(key);
      if (data != null) return resolve(JSON.parse(data));
      const newData = await cb;
      setex(key, process.env.REDIS_EXPIRATION, JSON.stringify(newData));
      resolve(newData);
    } catch {
      return reject(error.message);
    }
  });
};
async function getOverviewPost(Post, skip, limit, currentDate) {
  const pre = await Post.aggregate([
    {
      $project: {
        user: 1,
        title: 1,
        createdAt: { $subtract: [currentDate, '$createdAt'] },
        board: 1,
        likeNum: 1,
      },
    },
    {
      $sort: { likeNum: -1, createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  await Post.populate(pre, {
    path: 'user',
    select: 'photo',
  });
  const posts = await Post.populate(pre, {
    path: 'board',
    select: 'board',
  });
  return posts;
}

exports.getSideBar = catchAsync(async (req, res, next) => {
  const boards = await Board.find();
  res.locals.boards = boards;
  next();
});

exports.getOverview = catchAsync(async (req, res, next) => {
  const page = req.params.id || '1';
  const limit = 5;
  const skip = (page - 1) * limit;
  const currentDate = new Date();
  //caching
  const count = await getOrSetCache('post:count', Post.find().count());
  pages = Math.ceil(count / 5) + 1;
  //只對首頁進行caching
  let posts;
  if (page === '1') {
    posts = await getOrSetCache(
      'post:overview',
      getOverviewPost(Post, skip, limit, currentDate)
    );
  } else posts = await getOverviewPost(Post, skip, limit, currentDate);

  //Build and Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'A-CARD',
    posts,
    pages,
    req,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getRegistForm = (req, res) => {
  res.status(200).render('regist', {
    title: 'Regist your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getPostform = catchAsync(async (req, res, next) => {
  const boards = await Board.find();
  res.status(200).render('writePost', {
    title: 'A-CARD',
    boards,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).render('post', {
    title: 'A-CARD',
    post,
  });
});

exports.getBoardPost = catchAsync(async (req, res, next) => {
  const count = await Board.findById(req.params.id).count();
  const board = await Board.findById(req.params.id).populate({ path: 'posts' });
  const posts = board.posts;
  res.status(200).render('overview', {
    title: 'A-CARD',
    posts,
    count,
    req,
  });
});

async function getCardRelation(req) {
  //hit db
  const relation = await Relation.findOne({
    $and: [
      {
        $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
      },
      { isPair: true },
    ],
  });
  console.log(relation);
  //set cache
  await client.hmset(
    `user:${String(relation['userOne']['_id'])}:pair`,
    'pairUser',
    String(relation['userTwo']['_id']),
    'photo',
    String(relation['userTwo']['photo']),
    'name',
    String(relation['userTwo']['name']),
    'status',
    relation['relation']
  );
  await client.hmset(
    `user:${String(relation['userTwo']['_id'])}:pair`,
    'pairUser',
    String(relation['userOne']['_id']),
    'photo',
    String(relation['userOne']['photo']),
    'name',
    String(relation['userOne']['name']),
    'status',
    relation['relation']
  );
}
exports.getCard = catchAsync(async (req, res, next) => {
  // if cache miss, retrive from db
  const exist = await exists(`user:${String(req.user._id)}:pair`);
  if (!exist) await getCardRelation(req);
  //cache hit
  const pair = await hgetall(`user:${String(req.user._id)}:pair`);
  //response
  res.status(200).render('card', {
    title: 'A-CARD',
    pair,
  });
});

exports.getMessage = catchAsync(async (req, res, next) => {
  const inRoom = req.url.split('messages/')[1] !== undefined;
  const relations = await Relation.find({
    $and: [
      {
        $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
      },
      { relation: '2' },
    ],
  });
  let pairs = new Array();
  relations.forEach((relation) => {
    if (relation.userOne.id === req.user.id) {
      pairs.push(relation.userTwo);
    } else {
      pairs.push(relation.userOne);
    }
  });
  //res
  res.status(200).render('messageBox', {
    title: 'A-CARD',
    pairs,
    inRoom,
  });
});
