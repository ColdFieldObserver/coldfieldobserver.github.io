import { ref } from 'vue'

export function useBase64() {
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
      const encoded = btoa(unescape(encodeURIComponent(input.value)))
      result.value = encoded
      resultType.value = 'success'
    } catch {
      result.value = '编码失败：输入包含无效字符'
      resultType.value = 'error'
    }
  }

  function decode() {
    if (!input.value.trim()) {
      result.value = '请输入要解码的Base64文本'
      resultType.value = 'error'
      return
    }
    try {
      const decoded = decodeURIComponent(escape(atob(input.value)))
      result.value = decoded
      resultType.value = 'success'
    } catch {
      result.value = '解码失败：请输入有效的Base64编码'
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