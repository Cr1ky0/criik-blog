const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { contents } = req.body;
  if (!contents) {
    return next(new AppError('请输入内容！', 400));
  }

  const newComment = await Comment.create({
    contents,
    belongingUser: req.params.userId,
    belongingBlog: req.params.blogId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

// TODO:修改评论
