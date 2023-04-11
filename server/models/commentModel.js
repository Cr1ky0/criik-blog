const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
