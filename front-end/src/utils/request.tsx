import axios from 'axios';
import Cookies from 'universal-cookie';
import { message } from 'antd';

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
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录，分为登录信息错误和限制的路由，故不在这里处理
        case 401:
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403: {
          message.error('请重新登录！');
          const cookies = new Cookies();
          cookies.remove('user');
          cookies.remove('token');
          break;
        }
        // 404请求不存在
        case 404:
          message.error('路径不存在！');
          break;
        // 其他错误，直接抛出错误提示
        default:
          message.error('未知错误！');
          break;
      }
      return Promise.reject(error.response);
    }
  }
);

export default service;
