const Tag = require('./../models/tagModel');
const crud = require('./crudAction');
const AppError = require('./../utils/appError');

exports.getAllTag = crud.getAll(Tag, { path: 'posts' });
exports.getTag = crud.getOne(Tag, { path: 'posts' });
exports.createTag = crud.createOne(Tag);
exports.deleteTag = crud.deleteOne(Tag);
