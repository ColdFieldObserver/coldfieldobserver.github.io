import { ref } from 'vue'

export function useTimestamp() {
  const timestampInput = ref('')
  const datetimeInput = ref('')
  const result = ref('')
  const resultType = ref('')

  function timestampToDatetime() {
    const val = timestampInput.value.trim()
    if (!val) {
      result.value = '请输入时间戳'
      resultType.value = 'error'
      return
    }
    try {
      if (!/^\d+$/.test(val)) {
        throw new Error('时间戳必须为数字')
      }
      let ts = parseInt(val, 10)
      if (val.length <= 10) {
        ts *= 1000
      }
      const date = new Date(ts)
      if (isNaN(date.getTime())) {
        throw new Error('无效的时间戳')
      }
      const localTime = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      const utcTime = date.toUTCString()
      const isoString = date.toISOString().slice(0, 16)
      datetimeInput.value = isoString
      result.value = `本地时间：${localTime}\nUTC时间：${utcTime}\n时间戳类型：${val.length <= 10 ? '秒级' : '毫秒级'}`
      resultType.value = 'success'
    } catch (error) {
      result.value = `转换失败：${error.message}`
      resultType.value = 'error'
    }
  }

  function datetimeToTimestamp() {
    if (!datetimeInput.value) {
      result.value = '请选择日期时间'
      resultType.value = 'error'
      return
    }
    try {
      const date = new Date(datetimeInput.value)
      if (isNaN(date.getTime())) {
        throw new Error('无效的日期时间')
      }
      const tsSeconds = Math.floor(date.getTime() / 1000)
      const tsMilliseconds = date.getTime()
      timestampInput.value = String(tsSeconds)
      const localTime = date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      result.value = `秒级时间戳：${tsSeconds}\n毫秒级时间戳：${tsMilliseconds}\n本地时间：${localTime}`
      resultType.value = 'success'
    } catch (error) {
      result.value = `转换失败：${error.message}`
      resultType.value = 'error'
    }
  }

  function getCurrentTimestamp() {
    const now = new Date()
    const tsSeconds = Math.floor(now.getTime() / 1000)
    const tsMilliseconds = now.getTime()
    timestampInput.value = String(tsSeconds)
    const isoString = now.toISOString().slice(0, 16)
    datetimeInput.value = isoString
    const localTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    result.value = `当前时间戳（毫秒）：${tsMilliseconds}\n当前时间戳（秒）：${tsSeconds}\n当前本地时间：${localTime}`
    resultType.value = 'success'
  }

  function clear() {
    timestampInput.value = ''
    datetimeInput.value = ''
    result.value = ''
    resultType.value = ''
  }

  return { timestampInput, datetimeInput, result, resultType, timestampToDatetime, datetimeToTimestamp, getCurrentTimestamp, clear }
}