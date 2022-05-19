<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="Edit"
      :disabled="optionModel['use-data-source']"
      circle
      @click="dialogVisible = true"
    />
    <el-dialog v-model="dialogVisible" title="表格静态数据编辑">
      <CodeEditor
        :mode="'javascript'"
        :readonly="false"
        v-model="value"
        ref="ecEditor"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, toRaw } from 'vue'
import { Edit, Plus, Minus } from '@element-plus/icons-vue'
import CodeEditor from '@/components/code-editor/index'

const props = defineProps({
  optionModel: {
    type: Object
  }
})

const emit = defineEmits(['submit'])

//表格数据
const value = ref(props.optionModel.data)

//对话框
const dialogVisible = ref(false)

//提交结果
const handleSubmit = () => {
  emit('submit', value.value)
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped></style>
