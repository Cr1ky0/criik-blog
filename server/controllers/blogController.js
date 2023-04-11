const Blog = require('../models/blogModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  // 规则都放在query参数内了
  const features = new APIFeatures(
    Blog.find().populate({ path: 'blogs' }),
    req.query
  );
  const blogs = await features.query;

  res.status(200).json({
    status: 'success',
    results: blogs.length,
    data: {
      blogs,
    },
  });
});

exports.addBlog = catchAsync(async (req, res, next) => {
  const { title, classification, contents } = req.body;
  const newBlog = await Blog.create({
    title,
    classification,
    contents,
    belongTo: req.params.userId,
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: newBlog,
    },
  });
});
