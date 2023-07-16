const OSSClient = require('../utils/OSSClient');
const Image = require('../models/imgModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const filterObj = require('../utils/filterObj');

// controllers
exports.addPhotos = catchAsync(async (req, res) => {
  const imgs = await Image.create(
    req.body.map((img) => {
      return {
        filename: img.filename,
        classification: img.classification,
        photoTime: img.photoTime,
        belongTo: req.user._id,
      };
    })
  );

  res.status(201).json({
    status: 'success',
    data: [imgs],
  });
});

exports.getPhotos = catchAsync(async (req, res) => {
  const features = new APIFeatures(Image.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const images = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      images,
    },
  });
});

exports.getSelfPhotos = catchAsync(async (req, res) => {
  const features = new APIFeatures(
    Image.find({ belongTo: req.user._id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const images = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      images,
    },
  });
});

exports.getCount = catchAsync(async (req, res) => {
  const { classification } = req.query;
  const count = await Image.count({ belongTo: req.user._id, classification });
  res.status(200).json({
    status: 'success',
    data: {
      count,
    },
  });
});

exports.delSingle = catchAsync(async (req, res, next) => {
  const { filename } = req.body;
  const client = await OSSClient.getOSSClient();
  const result = await Image.deleteOne({
    filename: req.body.filename,
    belongTo: req.user._id,
  });
  if (result.deletedCount > 0) await client.delete(filename, { quiet: true });
  else next(new AppError('不能删除不是自己的相片！', 401));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.delMany = catchAsync(async (req, res, next) => {
  const { fileList } = req.body;
  const client = await OSSClient.getOSSClient();
  // 批量删除
  const result = await Image.deleteMany({
    filename: { $in: fileList },
    belongTo: req.user._id,
  });
  if (result.deletedCount > 0)
    await client.deleteMulti(fileList, { quiet: true });
  else next(new AppError('不能删除不是自己的相片！', 401));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateClass = catchAsync(async (req, res) => {
  const { fileList } = req.body;
  const filteredBody = filterObj(req.body, 'classification');
  const updatedList = await Image.updateMany(
    { filename: { $in: fileList }, belongTo: req.user._id },
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedList,
    },
  });
});
