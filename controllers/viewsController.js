const Post = require('../models/postModel');
const Board = require('../models/boardModel');
const Relation = require('../models/relationModel');
const catchAsync = require('../utils/catchAsync');
const { hgetall, setex, get } = require('.././utils/redis');

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
exports.getSideBar = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const boards = await Board.find();
  res.locals.boards = boards;
  next();
});
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
exports.getOverview = catchAsync(async (req, res, next) => {
  const page = req.params.id || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const currentDate = new Date();
  //redis search
  const count = await getOrSetCache('post:count', Post.find().count());
  const posts = await getOrSetCache(
    'post:overview',
    getOverviewPost(Post, skip, limit, currentDate)
  );
  // const posts = await getOverviewPost(Post, skip, limit, currentDate);
  // const pre = await Post.aggregate([
  //   {
  //     $project: {
  //       user: 1,
  //       title: 1,
  //       createdAt: { $subtract: [currentDate, '$createdAt'] },
  //       board: 1,
  //       likeNum: 1,
  //     },
  //   },
  //   {
  //     $sort: { likeNum: -1, createdAt: -1 },
  //   },
  //   {
  //     $skip: skip,
  //   },
  //   {
  //     $limit: limit,
  //   },
  // ]);

  // await Post.populate(pre, {
  //   path: 'user',
  //   select: 'photo',
  // });
  // const posts = await Post.populate(pre, {
  //   path: 'board',
  //   select: 'board',
  // });
  pages = Math.ceil(count / 5) + 1;
  // 3) Build and Render that template using tour data from 1)
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

exports.getPostform = catchAsync(async (req, res, next) => {
  const boards = await Board.find();
  res.status(200).render('writePost', {
    title: 'A-CARD',
    boards,
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

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
exports.getCard = catchAsync(async (req, res, next) => {
  const pair = await hgetall(`user:${String(req.user._id)}:pair`);
  // const relation = await Relation.findOne({
  //   $and: [
  //     {
  //       $or: [{ userOne: req.user._id }, { userTwo: req.user._id }],
  //     },
  //     { isFriend: false },
  //   ],
  // });
  // if (relation.userOne.id === req.user.id) {
  //   pair = relation.userTwo;
  // } else {
  //   pair = relation.userOne;
  // }
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
      { isFriend: true },
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
  res.status(200).render('messageBox', {
    title: 'A-CARD',
    pairs,
    inRoom,
  });
});

// exports.alerts = (req, res, next) => {
//   const { alert } = req.query;
//   if (alert === 'booking')
//     res.locals.alert =
//       "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
//   next();
// };

// exports.getTour = catchAsync(async (req, res, next) => {
//   // 1) Get the data, for the requested tour (including reviews and guides)
//   const tour = await Tour.findOne({ slug: req.params.slug }).populate({
//     path: 'reviews',
//     fields: 'review rating user',
//   });

//   if (!tour) {
//     return next(new AppError('There is no tour with that name.', 404));
//   }

//   // 2) Build template
//   // 3) Render template using data from 1)
//   res.status(200).render('tour', {
//     title: `${tour.name} Tour`,
//     tour,
//   });
// });

// exports.getMyTours = catchAsync(async (req, res, next) => {
//   // 1) Find all bookings
//   const bookings = await Booking.find({ user: req.user.id });

//   // 2) Find tours with the returned IDs
//   const tourIDs = bookings.map((el) => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   res.status(200).render('overview', {
//     title: 'My Tours',
//     tours,
//   });
// });

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updatedUser,
//   });
// });
