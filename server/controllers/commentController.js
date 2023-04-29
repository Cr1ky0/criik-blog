const Comment = require('../models/commentModel');
const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.getComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.getCommentsOfBlog = catchAsync(async (req, res, next) => {
  const comments = await Blog.findById(req.params.blogId)
    .populate({
      path: 'comments',
    })
    .select('comments');
  const commentsList = comments.comments;
  res.status(200).json({
    status: 'success',
    data: {
      comments: commentsList,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { contents, belongingBlog, username, brief } = req.body;
  if (!contents) {
    return next(new AppError('请输入内容！', 400));
  }

  const newComment = await Comment.create({
    contents,
    belongingUser: req.user ? req.user.id : '644c9a90f43dbdb4dc3296f8', // 如果没登录就设为默认用户
    belongingBlog: belongingBlog,
    username: username || '匿名',
    brief: brief || '这个人很懒，没有个性签名！',
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
