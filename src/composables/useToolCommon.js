import { ref } from 'vue'

export function useToolCommon() {
  const copyFeedback = ref('')

  function copyResult(text) {
    if (!text || text.includes('失败')) {
      return Promise.reject(new Error('没有可复制的内容'))
    }
    return navigator.clipboard.writeText(text).then(() => {
      copyFeedback.value = '已复制！'
      setTimeout(() => {
        copyFeedback.value = ''
      }, 2000)
    }).catch(() => {
      copyFeedback.value = '复制失败'
      setTimeout(() => {
        copyFeedback.value = ''
      }, 2000)
      return Promise.reject(new Error('复制失败'))
    })
  }

  function formatResult(text, type) {
    return { text, type }
  }

  return { copyResult, formatResult, copyFeedback }
}