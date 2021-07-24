import { ElMessage } from 'element-plus';
// 工具库

// 序列化
export const serialization = (keyMap:any):string => {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in keyMap) {
    // eslint-disable-next-line no-prototype-builtins
    if (keyMap.hasOwnProperty(key)) {
      result.push(`${key}=${keyMap[key]}`);
    }
  }
  return result.join('&');
};

// copy到粘贴板
export const copyToPaste = (str: string):void => {
  const input = document.createElement('input');
  input.value = str;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  input.style.display = 'none';
  document.body.removeChild(input);
  ElMessage.success('复制成功');
};
