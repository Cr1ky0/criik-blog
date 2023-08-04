// const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
// 创建 Elasticsearch 客户端
const client = new Client({
  node: 'http://localhost:9200',
  // auth: {
  //   username: 'elastic',
  //   password: 'NdsgnS_Z1dTl3B1mJcK-',
  // },
  // tls: {
  //   ca: fs.readFileSync('D:\\github\\criik-blog\\server\\ca\\http_ca.crt'),
  //   rejectUnauthorized: false,
  // },
});

module.exports = client;
