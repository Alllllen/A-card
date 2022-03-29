const Board = require('./../models/BoardModel');
const crud = require('./crudAction');
const AppError = require('./../utils/appError');

exports.getAllBoard = crud.getAll(Board, {});
exports.getBoard = crud.getOne(Board, { path: 'posts' });
exports.createBoard = crud.createOne(Board);
exports.deleteBoard = crud.deleteOne(Board);
