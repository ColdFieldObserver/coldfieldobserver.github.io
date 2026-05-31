import { ref } from 'vue'

export function useUnicode() {
  const input = ref('')
  const result = ref('')
  const resultType = ref('')

  function encode() {
    if (!input.value.trim()) {
      result.value = '请输入要编码的文本'
      resultType.value = 'error'
      return
    }
    try {
      let output = ''
      for (let i = 0; i < input.value.length; i++) {
        const charCode = input.value.charCodeAt(i)
        if (charCode <= 0xFFFF) {
          output += '\\u' + charCode.toString(16).toUpperCase().padStart(4, '0')
        } else {
          const highSurrogate = Math.floor((charCode - 0x10000) / 0x400) + 0xD800
          const lowSurrogate = ((charCode - 0x10000) % 0x400) + 0xDC00
          output += '\\u' + highSurrogate.toString(16).toUpperCase().padStart(4, '0') +
                    '\\u' + lowSurrogate.toString(16).toUpperCase().padStart(4, '0')
        }
      }
      result.value = output
      resultType.value = 'success'
    } catch {
      result.value = '编码失败：输入包含无效字符'
      resultType.value = 'error'
    }
  }

  function decode() {
    if (!input.value.trim()) {
      result.value = '请输入要解码的Unicode文本'
      resultType.value = 'error'
      return
    }
    try {
      const unicodeRegex = /\\u([0-9a-fA-F]{4})/g
      let output = input.value.replace(unicodeRegex, function(match, hex) {
        return String.fromCharCode(parseInt(hex, 16))
      })
      if (output.includes('\\u')) {
        throw new Error('无效的Unicode格式')
      }
      result.value = output
      resultType.value = 'success'
    } catch {
      result.value = '解码失败：请输入有效的Unicode编码格式（如\\u4F60\\u597D）'
      resultType.value = 'error'
    }
  }

  function clear() {
    input.value = ''
    result.value = ''
    resultType.value = ''
  }

  return { input, result, resultType, encode, decode, clear }
}