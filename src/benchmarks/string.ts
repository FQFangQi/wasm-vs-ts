/**字符串处理测试 - TypeScript 版本*/

/**字符串反转*/
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**检查字符串是否为回文*/
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**字符串拼接 (多次拼接)*/
export function concatenateStrings(str: string, times: number): string {
  let result = str;
  for (let i = 1; i < times; i++) {
    result += str;
  }
  return result;
}

/**查找子字符串*/
export function searchSubstring(str: string, pattern: string): number {
  return str.indexOf(pattern);
}

