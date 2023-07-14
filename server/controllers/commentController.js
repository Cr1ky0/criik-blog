const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');
const APIFeatures = require('../utils/apiFeatures');

exports.defaultParams = (req, res, next) => {
  req.query.limit = '5';
  next();
};

exports.getCommentNum = catchAsync(async (req, res) => {
  const comments = await Comment.find({ belongingBlog: req.params.blogId });
  const { length } = comments;
  res.status(200).json({
    status: 'success',
    data: {
      length,
    },
  });
});

exports.getComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.getCommentsOfBlog = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Comment.find({ belongingBlog: req.params.id }).populate('replys'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const comments = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      comments,
    },
  });
});

exports.addComment = catchAsync(async (req, res, next) => {
  const { contents, belongingBlog, username, brief, userId, userRole } =
    req.body;
  if (!contents) {
    return next(new AppError('请输入内容！', 400));
  }
  const user = await User.getAnonymousUserId();
  const newComment = await Comment.create({
    contents,
    belongingUser: userId || user,
    belongingBlog: belongingBlog,
    username: username || '匿名',
    userRole: userRole || 'visitor',
    brief: brief || '这个人很懒，没有个性签名！',
    publishAt: Date.now(),
  });
  res.status(201).json({
    status: 'success',
    data: {
      newComment,
    },
  });
});

exports.updateComment = catchAsync(async (req, res) => {
  // 目前仅设置更新likes数量
  const filteredBody = filterObj(req.body, 'likes');
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

exports.deleteComment = catchAsync(async (req, res) => {
  await Comment.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getComments = catchAsync(async (req, res) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: 'success',
    data: comments,
  });
});
