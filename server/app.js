const express = require('express');
const morgan = require('morgan');

// 安全相关插件
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// 应用相关
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 限制相同请求次数
// 1h内请求次数限制100次
const limiter = rateLimit({
  max: 100, // 次数
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// 对/api使用limiter中间件
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// 限制大小10kb
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// 防止数据库NoSQL注入攻击
app.use(mongoSanitize());

// Data sanitization against XSS
// 防止恶意代码注入
app.use(xss());

// Prevent parameter pollution
// 可以设置白名单
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// none page handle
app.all('*', (req, res, next) => {
  // next传递err可以被捕获
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 全局Error处理中间件
app.use(globalErrorHandler);
// app.use((err,req,res,next)=>{})这是一般error处理中间件的形式，当出现err参数时express会自动识别

module.exports = app;
