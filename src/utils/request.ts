import axios, { AxiosResponse } from 'axios';
import { API_ROOT } from '@/constants/constants';
import { getToken, logout } from './token';

const instance = axios.create({
  baseURL: API_ROOT,
  timeout: 30000,
});

// **路由请求拦截**
// http request 拦截器
instance.interceptors.request.use(
  (config) => {
    // 如果是mock数据请求，直接跳过授权流程
    if (config.baseURL === process.env.APP_MOCK) {
      return config;
    }
    // 判断是否存在token，即判断用户是否登录，如果存在的话，则每个http header都加上token
    if (getToken()) {
      const token = getToken() || '';
      // 每个http header 都加上 token
      // eslint-disable-next-line no-param-reassign
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error.response),
);

// http 响应 拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('response', response);
    // Do something with response data
    if (response.data && (response.data.errorCode === 201)) {
      logout();
      // message.error(response.data.errorMessage || '授权错误');
      // window.location.href = AUTH_URL;
      return Promise.reject(response.data.errorCode);
    }
    // 全局报错提示
    if (response.data && !response.data.success) {
      // message.error(response.data.subMessage || response.data.errorMessage || '');
      return Promise.reject(response.data.errorCode);
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.message) {
      // console.log(error.message);
      // message.error(error.message);
      return Promise.reject(error);
    }
    // console.log('error', error);
    return Promise.reject(JSON.stringify(error));
  },
);

export default instance;
