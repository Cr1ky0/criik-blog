const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // 规则都放在query参数内了
  const features = new APIFeatures(Blog.find(), req.query);
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
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
  if (!title || !contents) {
    return next(new AppError('请输入标题和内容！', 400));
  }
  const newBlog = await Blog.create({
    title,
    belongingMenu,
    contents,
    belongTo: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      newBlog,
    },
  });
});

exports.getBlogs = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'blogs',
  });
  res.status(200).json({
    status: 'success',
    data: {
      blogs: user.blogs,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  // 需要验证该博客是否为当前用户的博客
  if (blog.belongTo.toString() !== req.user.id) {
    return next(new AppError('不属于该用户的博客无法修改！', 403));
  }

  const filteredBody = filterObj(
    req.body,
    'contents',
    'classification',
    'title'
  );
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
  const blog = await Blog.findById(req.params.id);

  // 需要验证该博客是否为当前用户的博客
  if (blog.belongTo.toString() !== req.user.id) {
    return next(new AppError('不属于该用户的博客无法删除！', 403));
  }
  await Blog.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
