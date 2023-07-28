const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.defaultParams = (req, res, next) => {
  req.query.limit = '10';
  next();
};

// 根据idList排序
exports.changeSort = catchAsync(async (req, res, next) => {
  const { idList } = req.body;
  // eslint-disable-next-line array-callback-return
  idList.map((id, index) => {
    Blog.findByIdAndUpdate(id, { sort: index }).then(
      () => new Promise(() => {})
    );
  });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.getBlog = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.addBlog = catchAsync(async (req, res, next) => {
  const { title, belongingMenu, contents } = req.body;
  if (!belongingMenu) return next(new AppError('请选择分类！', 400));
  if (!title || !contents) return next(new AppError('请输入标题和内容！', 400));
  const maxSort = await Blog.find({ belongingMenu: belongingMenu })
    .sort({ sort: -1 })
    .select('_id sort')
    .limit(1);
  const newBlog = await Blog.create({
    title,
    belongingMenu,
    contents,
    belongTo: req.user.id,
    author: req.user.name,
    sort: maxSort[0] ? maxSort[0].sort + 1 : 0,
    publishAt: Date.now(),
  });

  res.status(201).json({
    status: 'success',
    data: {
      newBlog,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'contents',
    'belongingMenu',
    'title',
    'updateAt'
  );
  const { title, belongingMenu, contents } = req.body;
  if (!belongingMenu) return next(new AppError('请选择分类！', 400));
  if (!title || !contents) return next(new AppError('请输入标题和内容！', 400));
  const updatedBlog = await Blog.findByIdAndUpdate(
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
      updatedBlog,
    },
  });
});

exports.plusCommentCount = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.commentCount += 1;
  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.decreaseCommentCount = catchAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  blog.commentCount -= 1;
  await blog.save();

  res.status(200).json({
    status: 'success',
    data: {},
  });
});

exports.updateViewOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'views');
  const updatedBlog = await Blog.findByIdAndUpdate(
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
      updatedBlog,
    },
  });
});

exports.updateCollectOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'isCollected');
  const updatedBlog = await Blog.findByIdAndUpdate(
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
      updatedBlog,
    },
  });
});

exports.updateLikesOfBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'likes');
  const updatedBlog = await Blog.findByIdAndUpdate(
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
      updatedBlog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await Blog.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteBlogOfMenu = catchAsync(async (req, res, next) => {
  await Blog.updateMany(
    { belongingMenu: req.params.blogId },
    { active: false }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getSelfBlogs = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const features = new APIFeatures(
    Blog.find({
      belongTo: id,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.getSelfBlogNum = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const blogs = await Blog.find({ belongTo: id });
  const { length } = blogs;
  res.status(200).json({
    status: 'success',
    data: {
      length,
    },
  });
});

exports.getSelfTimeLine = catchAsync(async (req, res, next) => {
  const id = await User.getAdminUserId();
  const blogs = await Blog.find({ belongTo: id })
    .select('title publishAt id')
    .sort('-publishAt');

  res.status(200).json({
    status: 'success',
    data: {
      timeLine: blogs,
    },
  });
});

exports.getBlogWithComments = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Blog.find({ commentCount: { $gt: 0 } }).populate('comments'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      blogs,
    },
  });
});

exports.getBlogWithCommentsCount = catchAsync(async (req, res) => {
  const count = await Blog.count({ commentCount: { $gt: 0 } });

  res.status(200).json({
    status: 'success',
    data: {
      count,
    },
  });
});

// 更新所有blog的commentCount为当前comments的长度
exports.syncCommentCount = catchAsync(async (req, res) => {
  const blogs = await Blog.find().populate('comments');

  blogs.forEach((blog) => {
    blog.commentCount = blog.comments.length;
    blog.save();
  });

  res.status(200).json({
    status: 'success',
    data: {},
  });
});
