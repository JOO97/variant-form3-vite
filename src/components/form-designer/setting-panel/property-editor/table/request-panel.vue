<template>
  <el-dialog v-model="show" title="测试数据源" @close="handleClose">
    <template #title>
      <div class="dialog-header">
        <div>测试数据源</div>
        <div style="margin-right: 15px">
          <el-button type="primary" plain @click="runReq">测试</el-button>
        </div>
      </div>
    </template>
    <el-divider content-position="left">请求条件</el-divider>
    <code-editor
      mode="json"
      :readonly="true"
      v-model="reqJson"
      ref="ecEditor2"
    />
    <el-divider content-position="left">请求结果</el-divider>
    <code-editor mode="json" :readonly="true" v-model="result" ref="ecEditor" />
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import axios from 'axios'

import CodeEditor from '@/components/code-editor/index'

const props = defineProps({
  modelValue: Boolean,
  payload: Object
})
const emit = defineEmits(['on-close'])

const show = ref(true)

//请求参数
const req = ref({})
//编辑器实例
const ecEditor = ref(null)
const ecEditor2 = ref(null)

onMounted(() => {
  const { url, method, headers, params, data } = props.payload
  req.value = {
    url,
    method,
    headers,
    params,
    data
  }
})

const reqJson = computed(() => {
  return JSON.stringify(req.value, null, '  ')
})

const handleClose = () => {
  emit('on-close', false)
}

//请求结果
const result = ref('')

//发送请求
const runReq = () => {
  const { url, method, params, headers, data } = req.value
  axios
    .request({
      url,
      method
    })
    .then(({ status, statusText, data }) => {
      if (status === 200) {
        result.value = JSON.stringify(data, null, '  ')
      } else {
        result.value = JSON.stringify(
          {
            status,
            statusText
          },
          null,
          '  '
        )
      }
      //NOTE: 需要调用setValue
      ecEditor.value.setValue(result.value)
    })
}
</script>
