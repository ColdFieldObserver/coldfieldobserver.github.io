import { ref } from 'vue'

export function useUrl() {
  const input = ref('')
  const result = ref('')
  const resultType = ref('')

  function encodeURL() {
    if (!input.value.trim()) {
      result.value = '请输入要编码的URL文本'
      resultType.value = 'error'
      return
    }
    try {
      result.value = encodeURI(input.value)
      resultType.value = 'success'
    } catch {
      result.value = '编码失败：输入包含无效字符'
      resultType.value = 'error'
    }
  }

  function decodeURL() {
    if (!input.value.trim()) {
      result.value = '请输入要解码的URL文本'
      resultType.value = 'error'
      return
    }
    try {
      result.value = decodeURI(input.value)
      resultType.value = 'success'
    } catch {
      result.value = '解码失败：请输入有效的URL编码'
      resultType.value = 'error'
    }
  }

  function encodeComponent() {
    if (!input.value.trim()) {
      result.value = '请输入要编码的URL组件文本'
      resultType.value = 'error'
      return
    }
    try {
      result.value = encodeURIComponent(input.value)
      resultType.value = 'success'
    } catch {
      result.value = '编码失败：输入包含无效字符'
      resultType.value = 'error'
    }
  }

  function decodeComponent() {
    if (!input.value.trim()) {
      result.value = '请输入要解码的URL组件文本'
      resultType.value = 'error'
      return
    }
    try {
      result.value = decodeURIComponent(input.value)
      resultType.value = 'success'
    } catch {
      result.value = '解码失败：请输入有效的URL组件编码'
      resultType.value = 'error'
    }
  }

  function clear() {
    input.value = ''
    result.value = ''
    resultType.value = ''
  }

  return { input, result, resultType, encodeURL, decodeURL, encodeComponent, decodeComponent, clear }
}