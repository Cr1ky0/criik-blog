const moment = require('moment');
const { Buffer } = require('buffer');
const catchAsync = require('../utils/catchAsync');
const OSSClient = require('../utils/OSSClient');
const OSSModel = require('../models/OSSModel');

// 初始化
OSSModel.getInstance();

exports.setConfig = catchAsync(async (req, res) => {
  const { region, accessKeyId, accessKeySecret, bucket, callbackUrl, dir } =
    req.body;
  const OSSObject = await OSSModel.findOneAndUpdate({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    callbackUrl: callbackUrl || '',
    dir: dir || '',
    isUsed: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      OSSObject,
    },
  });
});

exports.getConfig = catchAsync(async (req, res) => {
  const OSSObject = await OSSModel.getInstance();

  res.status(200).json({
    status: 'success',
    data: {
      OSSObject,
    },
  });
});

exports.getPolicy = async (req, res) => {
  const client = await OSSClient.getOSSClient();
  const config = await OSSClient.getOSSConfig();
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const policy = {
    expiration: date.toISOString(), // 请求有效期
    conditions: [
      ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
      // { bucket: client.options.bucket } // 限制可上传的bucket
    ],
  };

  //  跨域才设置
  res.set({
    'Access-Control-Allow-Origin': req.headers.origin || '*',
    'Access-Control-Allow-Methods': 'PUT,POST,GET',
  });

  //签名
  const formData = await client.calculatePostSignature(policy);
  //bucket域名
  const host = `http://${config.bucket}.${
    (await client.getBucketLocation()).location
  }.aliyuncs.com`.toString();
  //回调
  const callback = {
    callbackUrl: config.callbackUrl,
    callbackBody:
      'filename=${object}&size=${size}&mimeType=${mimeType}&height=${imageInfo.height}&width=${imageInfo.width}',
    callbackBodyType: 'application/x-www-form-urlencoded',
  };

  //返回参数
  const params = {
    expire: moment().add(1, 'days').unix().toString(),
    policy: formData.policy,
    signature: formData.Signature,
    accessid: formData.OSSAccessKeyId,
    host,
    callback: Buffer.from(JSON.stringify(callback)).toString('base64'),
    dir: config.dir,
  };

  res.json(params);
};

//接收回调
exports.getResult = (req, res) => {
  //公钥地址
  const pubKeyAddr = Buffer.from(
    req.headers['x-oss-pub-key-url'],
    'base64'
  ).toString('ascii');
  //判断
  if (
    !pubKeyAddr.startsWith('https://gosspublic.alicdn.com/') &&
    !pubKeyAddr.startsWith('https://gosspublic.alicdn.com/')
  ) {
    res.json({ Status: 'verify not ok' });
  }
  res.json({ Status: 'Ok' });
};
