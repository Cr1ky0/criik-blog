const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 安全相关插件
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// 应用相关
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const commentRouter = require('./routes/commentRoutes');
const menuRouter = require('./routes/menuRoutes');

const app = express();

// Implement CORS
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.options('*', cors());

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

// 限制query参数和json大小10kb
app.use(express.json({ limit: '120kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// cookie
app.use(cookieParser());

// session
app.use(
  session({
    name: 'codeSession',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true, //在每次请求时强行设置 cookie，这将重置cookie过期时间（默认：false）
    store: MongoStore.create({
      mongoUrl: 'mongodb://criiky0:123456@127.0.0.1:27017/criik-blog', //数据库的地址
      ttl: 10 * 60,
    }),
    // 设置发送给前端的cookie属性
    cookie: {
      secure: false,
      httpOnly: true,
      path: '/api/users',
      maxAge: 1000 * 60 * 10,
    },
  })
);

// 3) ROUTES
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);
app.use('/api/menus', menuRouter);

// none page handle
app.all('*', (req, res, next) => {
  // next传递err可以被捕获
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 全局Error处理中间件
app.use(globalErrorHandler);
// app.use((err,req,res,next)=>{})这是一般error处理中间件的形式，当出现err参数时express会自动识别

module.exports = app;
