import axios from '@/utils/request';

/**
 * 获取token
 * @param code
 */
export function authTokenApi(code: string) {
  return axios.get('/auth/getToken', {
    params: { code },
  }).then((res) => res.data);
}

export function setToken() {
  return axios.get('/auth/getToken', {
    params: { },
  }).then((res) => res.data);
}
