const TOKEN_KEY = 'userToken';
const SHOP_ID = 'shopId';

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || '';
}

export function setShopId(data: string) {
  sessionStorage.setItem(SHOP_ID, data);
}

export function setToken(data: string) {
  sessionStorage.setItem(TOKEN_KEY, data);
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
}
