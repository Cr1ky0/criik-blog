const path = require('path');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 安全相关插件
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// 应用相关
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const commentRouter = require('./routes/commentRoutes');
const menuRouter = require('./routes/menuRoutes');
const replyCommentRouter = require('./routes/replyCommentRoutes');
const OSSPolicyRoutes = require('./routes/OSSPolicyRoutes');
const imagesRoutes = require('./routes/imagesRoutes');
const emailRoutes = require('./routes/emailRoutes');
const esRoutes = require('./routes/esRoutes');

const app = express();

// CORS
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3002'],
  })
);
app.options('*', cors());

// Set security HTTP headers
// app.use(
//   helmet({
//     // 解决解决NotSameOriginAfterDefaultedToSameOriginByCoep问题
//     crossOriginEmbedderPolicy: { policy: 'credentialless' },
//     contentSecurityPolicy: {
//       directives: {
//         'img-src': [
//           "'self'",
//           'data:',
//           'blob:',
//           'criik-blog-image-storage.oss-cn-chengdu.aliyuncs.com',
//         ],
//         'connect-src': [
//           "'self'",
//           'https://www.criiky0.top',
//           'https://api.itapi.cn/api/badword/',
//         ],
//       },
//     },
//   })
// );

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 限制请求次数
// const limiter = rateLimit({
//   max: 50, // 次数
//   windowMs: 60 * 1000,
//   message: '请求数过多，请稍后再试！',
// });

// 对/api使用limiter中间件
// app.use('/api', limiter);

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

// cookie
app.use(cookieParser());

// session
app.use(
  session({
    name: 'codeSession',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, //在每次请求时强行设置 cookie，这将重置cookie过期时间（默认：false）
    // 设置发送给前端的cookie属性
    store: MongoStore.create({
      mongoUrl: 'mongodb://criiky0:123456@127.0.0.1:27017/criik-blog', //数据库的地址
      ttl: 10 * 60,
    }),
    cookie: {
      secure: false, // 注意这里表示仅HTTPS传输，如果开发环境不是HTTPS这里设为false
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
app.use('/api/reply', replyCommentRouter);
app.use('/api/policy', OSSPolicyRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/es', esRoutes);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// 这里解决刷新后BrowserRouter导致的链接丢失问题
// 实际上这里将全部非法链接指向index页面，然后由index页面去处理路由（前端做了404page，后端就不用处理404了）
// 一定要放到routes后面，不然路由直接匹配上了
app.get('/*', (req, res) => {
  return res.sendFile(
    path.join(path.resolve(path.dirname('')), './public', 'index.html')
  );
});

// 全局Error处理中间件
app.use(globalErrorHandler);
// app.use((err,req,res,next)=>{})这是一般error处理中间件的形式，当出现err参数时express会自动识别

module.exports = app;
