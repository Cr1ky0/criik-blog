const Comment = require('../models/commentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const fs = require('fs');

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
    belongingUser: req.user.id,
    belongingBlog: req.params.blogId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.belongingUser.toString() !== req.user.id) {
    return next(new AppError('不属于该用户评论的无法更新！', 403));
  }
  const filteredBody = filterObj(req.body, 'contents');
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedComment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (comment.belongingUser.toString() !== req.user.id) {
    return next(new AppError('不属于该用户评论的无法删除！', 403));
  }

  await Comment.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
