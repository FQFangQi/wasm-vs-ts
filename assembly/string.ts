// 字符串处理测试 - AssemblyScript 版本

// 字符串反转
export function reverseString(str: string): string {
  let chars = String.UTF8.encode(str, true);
  let len = chars.byteLength;
  let charsArray = Uint8Array.wrap(chars);
  let result = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    result[i] = charsArray[len - 1 - i];
  }
  
  return String.UTF8.decodeUnsafe(result.dataStart, len);
}

// 检查字符串是否为回文
export function isPalindrome(str: string): bool {
  let chars = String.UTF8.encode(str, true);
  let len = chars.byteLength;
  let charsArray = Uint8Array.wrap(chars);
  let left = 0;
  let right = len - 1;
  
  while (left < right) {
    if (charsArray[left] != charsArray[right]) {
      return false;
    }
    left++;
    right--;
  }
  
  return true;
}

// 字符串拼接 (多次拼接)
export function concatenateStrings(str: string, times: i32): string {
  let result = str;
  for (let i = 1; i < times; i++) {
    result = result + str;
  }
  return result;
}

// 查找子字符串
export function searchSubstring(str: string, pattern: string): i32 {
  let text = String.UTF8.encode(str, true);
  let pat = String.UTF8.encode(pattern, true);
  
  let textLen = text.byteLength;
  let patLen = pat.byteLength;
  let textArray = Uint8Array.wrap(text);
  let patArray = Uint8Array.wrap(pat);
  
  if (patLen > textLen) return -1;
  
  for (let i = 0; i <= textLen - patLen; i++) {
    let match = true;
    for (let j = 0; j < patLen; j++) {
      if (textArray[i + j] != patArray[j]) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  
  return -1;
}

