<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="SetUp"
      circle
      @click="dialogVisible = true"
      :disabled="!optionModel['use-data-source']"
    />
    <el-dialog v-model="dialogVisible" :show-close="false">
      <template #title="{ titleId, titleClass }">
        <div class="dialog-header">
          <div :id="titleId" :class="titleClass">表格数据源配置</div>
          <div>
            <el-button type="primary" plain @click="showRequestPanel = true">
              测试数据源
            </el-button>
            <!-- <el-icon @click="close" style="font-size: 18px"
              ><CircleCloseFilled
            /></el-icon> -->
          </div>
        </div>
      </template>
      <el-form
        :model="formData"
        ref="form"
        :rules="rules"
        label-position="left"
        label-width="80px"
        size="medium"
      >
        <el-form-item
          label="数据源名称"
          label-width="120px"
          prop="name"
          class="required"
        >
          <el-input v-model="formData.name" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="请求地址"
          label-width="120px"
          prop="url"
          class="required"
        >
          <el-input v-model="formData.url" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="请求方法"
          label-width="120px"
          prop="method"
          class="required"
        >
          <el-radio-group v-model="formData.method">
            <el-radio-button
              :label="method"
              v-for="method in METHODS"
              :key="method"
            />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求头" label-width="120px" prop="headers">
          <CodeEditor
            ref="headersEditor"
            mode="json"
            :readonly="false"
            v-model="formData.headers"
            class="data-source-editor"
          />
        </el-form-item>
        <el-form-item label="params" label-width="120px" prop="params">
          <CodeEditor
            ref="paramsEditor"
            mode="json"
            :readonly="false"
            v-model="formData.params"
            class="data-source-editor"
          />
        </el-form-item>
        <el-form-item label="data" label-width="120px" prop="data">
          <CodeEditor
            ref="dataEditor"
            mode="json"
            :readonly="false"
            v-model="formData.data"
            class="data-source-editor"
          />
        </el-form-item>
      </el-form>
      <div>
        <el-divider>请求/响应处理</el-divider>
        <el-collapse :model-value="['1']">
          <el-collapse-item title="请求拦截" name="1">
            <el-alert
              type="info"
              :closable="false"
              :title="beforeRequest.header"
            ></el-alert>
            <CodeEditor
              :mode="'javascript'"
              :readonly="false"
              v-model="beforeRequest.handler"
              ref="ecEditor"
            />
          </el-collapse-item>
          <el-collapse-item title="响应拦截" name="2">
            <el-alert
              type="info"
              :closable="false"
              :title="afterResponse.header"
            ></el-alert>
            <CodeEditor
              :mode="'javascript'"
              :readonly="false"
              v-model="afterResponse.handler"
              ref="ecEditor"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <RequestPanel
      v-if="showRequestPanel"
      :payload="formData"
      @on-close="showRequestPanel = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { SetUp, CircleCloseFilled } from '@element-plus/icons-vue'
import CodeEditor from '@/components/code-editor/index'

import RequestPanel from './request-panel.vue'

//constant
const METHODS = ['GET', 'POST']

const props = defineProps({
  optionModel: {
    type: Object
  }
})

//表单数据
const formData = ref({
  ...props.optionModel['data-source'],
  ...props.optionModel['data-source'].request
})

onMounted(() => {})

const emit = defineEmits(['submit'])

//对话框
const dialogVisible = ref(false)
//RequestPanel props
const showRequestPanel = ref(false)

//请求相关方法
const beforeRequest = ref({
  header: 'interceptorsRequest(config)',
  handler: props.optionModel['data-source'].onBeforeRequest
    ? props.optionModel['data-source'].onBeforeRequest
    : 'return config'
})

const afterResponse = ref({
  header: 'interceptorsResponse(response)',
  handler: props.optionModel.onAfterResponse
    ? props.optionModel.onAfterResponse
    : 'return response.data'
})

//提交结果
const handleSubmit = () => {
  console.log('beforeRequest.value.handler', beforeRequest.value.handler)
  const result = { request: {} }

  //TODO: 数据校验
  result.onBeforeRequest = beforeRequest.value.handler
  result.onAfterResponse = afterResponse.value.handler
  Object.keys(formData.value).forEach((key) => {
    if (key === 'name' || key === 'type') {
      result[key] = formData.value[key]
    } else {
      result.request[key] = formData.value[key]
    }
  })
  emit('submit', JSON.stringify(result))
  dialogVisible.value = false
}
</script>

<style lang="scss">
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
.data-source-editor {
  width: 100%;
  min-height: 50px;
  max-height: 70px;
  overflow-y: auto;
  border: 1px solid #eee;
}
</style>
