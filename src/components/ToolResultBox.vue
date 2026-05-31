<template>
  <div class="form-group">
    <label class="form-label">{{ label }}</label>
    <div class="tool-result-box" :class="resultType">{{ displayText }}</div>
    <button
      class="btn btn-secondary btn-sm"
      @click="handleCopy"
      ref="copyBtnRef"
    >
      {{ copyButtonText }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '结果：',
  },
  result: {
    type: String,
    default: '',
  },
  resultType: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '结果将显示在这里...',
  },
})

const emit = defineEmits(['copy'])

const copyBtnRef = ref(null)
const localCopyText = ref('')

const displayText = computed(() => props.result || props.placeholder)

const copyButtonText = computed(() => localCopyText.value || '复制结果')

function handleCopy() {
  if (!props.result || props.result === props.placeholder || props.result.includes('失败')) {
    return
  }
  navigator.clipboard.writeText(props.result).then(() => {
    localCopyText.value = '已复制！'
    setTimeout(() => {
      localCopyText.value = ''
    }, 2000)
    emit('copy')
  }).catch(() => {
    localCopyText.value = '复制失败'
    setTimeout(() => {
      localCopyText.value = ''
    }, 2000)
  })
}
</script>