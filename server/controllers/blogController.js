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
  const blog = await Blog.findById(req.params.id).populate({
    path: 'comments',
  });

  res.status(200).json({
    status: 'success',
    data: {
      blog,
    },
  });
});

exports.addBlog = catchAsync(async (req, res, next) => {
  const { title, classification, contents } = req.body;
  if (!title || !contents) {
    return next(new AppError('请输入标题和内容！', 400));
  }
  const newBlog = await Blog.create({
    title,
    classification,
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

// TODO:修改博客
exports.updateBlog = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'contents');
  const updatedBlog = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
});
