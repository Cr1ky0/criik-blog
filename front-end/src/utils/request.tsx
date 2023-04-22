import axios from 'axios';
import Cookies from 'universal-cookie';
import { message } from 'antd';

message.config({
  top: 50,
  maxCount: 3,
  duration: 1,
});

const service = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:3002',
});

// 都用json发数据
service.defaults.headers.post['Content-Type'] = 'application/json';

//请求拦截器
service.interceptors.request.use(config => {
  // 附加token
  const cookies = new Cookies();
  const token = cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  async error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 400也有很多情况，不在这处理
        case 400:
          break;
        // 401: 未登录，分为登录信息错误和限制的路由，故不在这里处理
        case 401:
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403: {
          const cookies = new Cookies();
          cookies.remove('user');
          cookies.remove('token');
          break;
        }
        // 404请求不存在
        case 404:
          break;
        // 其他错误，仍然其他地方处理
        default:
          break;
      }
      // 全局提示
      await message.error(error.response.data.message);
      return Promise.reject(error.response);
    }
  }
);

export default service;
