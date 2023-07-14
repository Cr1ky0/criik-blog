const ReplyComment = require('../models/replyCommentModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.addReply = catchAsync(async (req, res, next) => {
  const { contents, username, brief, userId, userRole, belongingComment } =
    req.body;
  if (!contents) {
    return next(new AppError('请输入内容！', 400));
  }
  const user = await User.getAnonymousUserId();
  const reply = await ReplyComment.create({
    contents,
    belongingUser: userId || user,
    username: username || '匿名',
    userRole: userRole || 'visitor',
    brief: brief || '这个人很懒，没有个性签名！',
    belongingComment,
    publishAt: Date.now(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      reply,
    },
  });
});

exports.updateComment = catchAsync(async (req, res) => {
  // 目前仅设置更新likes数量
  const filteredBody = filterObj(req.body, 'likes');
  const updatedComment = await ReplyComment.findByIdAndUpdate(
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
  await ReplyComment.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
