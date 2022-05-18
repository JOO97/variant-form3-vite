<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="SetUp"
      circle
      @click="dialogVisible = true"
      :disabled="!disabled"
    />
    <el-dialog v-model="dialogVisible" :show-close="false" draggable>
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
          <el-input
            v-model="formData.headers"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="params" label-width="120px" prop="params">
          <el-input
            v-model="formData.params"
            clearable
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="data" label-width="120px" prop="data">
          <el-input
            v-model="formData.data"
            clearable
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-divider content-position="left">请求配置</el-divider>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false"
            >Cancel-{{ showRequestPanel }}</el-button
          >
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
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

import RequestPanel from './request-panel.vue'

//constant
const METHODS = ['GET', 'POST']

const props = defineProps({
  data: {
    type: Object
  },
  disabled: Boolean
})

//表单数据
const formData = ref({ ...props.data, ...props.data.request })

onMounted(() => {})

const emit = defineEmits(['submit'])

//对话框
const dialogVisible = ref(false)
//RequestPanel props
const showRequestPanel = ref(false)

//提交结果
const handleSubmit = () => {
  //TODO: 数据校验
  emit('submit')
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
</style>
