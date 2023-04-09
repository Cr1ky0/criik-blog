const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
// const fs = require('fs');
// const Tour = require('./models/tourModel');

// 其他错误终止服务
// 放在开头以捕获全部错误
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' }); // 只需读取一次全局可用

// 数据库配置
// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD); // 当使用远程服务器时使用这个，DATABASE变量里的<PASSWORD>替换为实际密码
const DB = process.env.DATABASE_LOCAL; // 本地用这个

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    // console.log(connection.connections); // 查看链接属性
    console.log('DB connection successful!');
  });

// // READ JSON FILE
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
// );

// // IMPORT DATA INTO DB
// const importData = async () => {
//   try {
//     await Tour.create(tours);
//     console.log('Data successfully loaded!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// // DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await Tour.deleteMany();
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// // process.argv存放了启动时后面添加的变量，nodemon sever.js --import/--delete
// // 这种方法可以指定某种参数来在启动时执行特定功能
// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }

// listen
const port = process.env.PORT || 3000; // 使用config中变量
const server = app.listen(port, () => {
  console.log(`server is listening at port${port}`);
});

// 处理 没有处理的promise rejection错误
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
