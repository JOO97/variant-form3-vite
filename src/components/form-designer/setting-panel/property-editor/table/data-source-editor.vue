<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="SetUp"
      circle
      @click="dialogVisible = true"
    />
    <el-dialog v-model="dialogVisible" title="表格数据源配置" draggable>
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
          <el-input v-model="formData.method" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="请求头" label-width="120px" prop="headers">
          <el-input v-model="formData.headers" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="params" label-width="120px" prop="params">
          <el-input v-model="formData.params" type="text" clearable></el-input>
        </el-form-item>
        <el-form-item label="data" label-width="120px" prop="data">
          <el-input v-model="formData.data" type="text" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import { SetUp } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array
  }
})
onMounted(() => {})

const emit = defineEmits(['submit'])

//对话框
const dialogVisible = ref(false)

//提交结果
const handleSubmit = () => {
  //TODO: 数据校验
  emit('submit')
  dialogVisible.value = false
}

//
</script>

<style lang="scss" scoped></style>
