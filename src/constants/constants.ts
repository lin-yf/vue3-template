export const API_ROOT = process.env.API_ROOT ? process.env.API_ROOT : 'http:// pddweb.superboss.cc';

export default {
  API_ROOT,
  // 获取用户信息
  getUserInfo: '/getUserInfo',
  getCategoryDetail: '/category/detail',
};
