<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="Edit"
      circle
      @click="dialogVisible = true"
      :disabled="!optionModel['show-operation']"
    />
    <el-dialog v-model="dialogVisible" title="操作列编辑">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="列名" :label-width="80">
            <el-input
              v-model="formData.label"
              type="text"
              clearable
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列宽度(px)" :label-width="100">
            <el-input-number
              v-model="formData.width"
              style="width: 100%"
              controls-position="right"
              :min="100"
              :max="100000000000"
              :precision="0"
              :step="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider>操作按钮设置</el-divider>
      <el-table v-bind="componentData" class="columns-table" row-key="prop">
        <template
          v-for="(option, index) in tableColumns"
          :key="index + '_tableColumns'"
        >
          <el-table-column
            v-bind="option"
            v-if="!['operation', 'draggable'].includes(option.prop)"
          >
            <template
              v-if="option.type && option.type !== 'index'"
              #default="{ $index }"
            >
              <component
                :is="option.type"
                v-model="formData.list[$index][option.prop]"
              >
                <template v-if="option.child">
                  <component
                    :is="option.child.type"
                    v-for="child in option.child.options"
                    :key="child.value + index"
                    :label="child.label"
                    :value="child.value"
                  />
                </template>
              </component>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="option.prop === 'draggable'"
            v-bind="option"
            width="50px"
          >
            <template #default>
              <i class="iconfont icon-drag drag-option handle" />
            </template>
          </el-table-column>
          <el-table-column label="操作" v-else width="100">
            <template #default="scope">
              <el-button
                size="small"
                type="primary"
                :icon="Plus"
                circle
                @click="handleAddRow(scope.$index, scope.row)"
              />
              <el-button
                size="small"
                type="danger"
                :icon="Minus"
                circle
                @click="handleRemoveRow(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </template>
      </el-table>
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
import { ref, computed, reactive, toRaw, onMounted, watch, nextTick } from 'vue'
import { Edit, Plus, Minus } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'

import { deepClone } from '@/utils/util'

const props = defineProps({
  optionModel: {
    type: Array
  }
})

const emit = defineEmits(['submit'])

//表单数据
let formData = reactive({
  label: '操作',
  width: '120',
  list: []
})

//对话框
const dialogVisible = ref(false)

watch(dialogVisible, (nVal) => {
  if (nVal) {
    nextTick(() => {
      sortable('columns-table')
      formData.label = props.optionModel.operations.label
      formData.width = props.optionModel.operations.width
      formData.list = deepClone(props.optionModel.operations.list)
    })
  }
})

//拖拽
const sortable = (className) => {
  const table = document.querySelector(
    '.' + className + ' .el-table__body-wrapper tbody'
  )
  Sortable.create(table, {
    handle: '.handle',
    // 拖拽完毕后触发
    onEnd({ newIndex, oldIndex }) {
      if (newIndex === oldIndex) return
      formData.list.splice(newIndex, 0, formData.list.splice(oldIndex, 1)[0])
    }
  })
}

//配置项
const tableColumns = [
  {
    prop: 'draggable'
  },
  {
    prop: 'name',
    label: '操作名称',
    type: 'el-input'
  },
  {
    prop: 'label',
    label: '显示名称',
    type: 'el-input'
  },
  {
    prop: 'type',
    label: '按钮类型',
    type: 'el-select',
    child: {
      type: 'el-option',
      options: [
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'primary',
          value: 'primary'
        },
        {
          label: 'success',
          value: 'success'
        },
        {
          label: 'warning',
          value: 'warning'
        },
        {
          label: 'danger',
          value: 'danger'
        },
        {
          label: 'info',
          value: 'info'
        }
      ]
    }
  },
  {
    prop: 'size',
    label: '按钮大小',
    type: 'el-select',
    child: {
      type: 'el-option',
      options: [
        {
          label: 'default',
          value: 'default'
        },
        {
          label: 'small',
          value: 'small'
        },
        {
          label: 'large',
          value: 'large'
        }
      ]
    }
  },
  {
    prop: 'circle',
    label: '圆角',
    type: 'el-switch'
  },
  {
    prop: 'plain',
    label: '朴素按钮',
    type: 'el-switch'
  },
  {
    prop: 'disable',
    label: '禁用',
    type: 'el-switch'
  },
  {
    prop: 'visible',
    label: '显示',
    type: 'el-switch'
  },
  {
    prop: 'emit',
    label: '抛出事件',
    type: 'el-switch'
  }
]

//component data
const componentData = computed(() => {
  return {
    data: formData.list.map((item) => ({ ...item, draggable: true })),
    'table-layout': 'auto',
    stripe: true,
    size: 'large',
    border: true
  }
})

//drag
const dragging = ref(false)
const dragEnabled = ref(true)

//增加、移除行
const handleAddRow = (index, row) => {
  formData.list.splice(index + 1, 0, {
    prop: '',
    label: '',
    width: '',
    sortable: false,
    fixed: false,
    align: 'left'
  })
}
const handleRemoveRow = (index, row) => {
  formData.list.splice(index, 1)
}

//提交结果
const handleSubmit = () => {
  //TODO: 数据校验
  emit('submit', deepClone(formData))
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.sortable-ghost {
  opacity: 0.4;
  background-color: #f4e2c9;
}
</style>
