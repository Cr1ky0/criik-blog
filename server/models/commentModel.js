const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // 评论内容
  contents: {
    type: String,
    trim: true,
    required: [true, '请输入评论'],
  },
  // 点赞数
  likes: {
    type: Number,
    default: 0,
  },
  // 发布时间
  publishAt: {
    type: Date,
    default: Date.now(),
  },
  // 删除标志
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  // 所属用户 (parent ref)
  belongingUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  // 所属博客 (parent ref)
  belongingBlog: {
    type: mongoose.Schema.ObjectId,
    ref: 'Blog',
  },
});

commentSchema.pre(/^(find)|(populate)/, function (next) {
  this.find({ active: { $ne: false } }).select('-__v');
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;