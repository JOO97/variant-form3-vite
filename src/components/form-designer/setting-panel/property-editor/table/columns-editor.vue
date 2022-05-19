<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="Edit"
      circle
      @click="dialogVisible = true"
    />
    <el-dialog v-model="dialogVisible" title="表格列编辑">
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
                v-model="tableData[$index][option.prop]"
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

const props = defineProps({
  data: {
    type: Array
  }
})

const emit = defineEmits(['submit'])

//对话框
const dialogVisible = ref(false)

watch(dialogVisible, (nVal) => {
  if (nVal) {
    nextTick(() => {
      sortable('columns-table')
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
      tableData.splice(newIndex, 0, tableData.splice(oldIndex, 1)[0])
    }
  })
}

//表格数据
const tableData = reactive(props.data.map((item) => item))

//列
const tableColumns = reactive([
  {
    prop: 'draggable'
  },
  {
    prop: 'prop',
    label: '字段名称',
    type: 'el-input'
  },
  {
    prop: 'label',
    label: '显示名称',
    type: 'el-input'
  },
  {
    prop: 'width',
    label: '列宽',
    type: 'el-input'
  },
  {
    prop: 'sortable',
    label: '是否排序',
    type: 'el-switch'
  },
  {
    prop: 'fixed',
    label: '是否固定',
    type: 'el-switch'
  },
  {
    prop: 'align',
    label: '对齐方式',
    type: 'el-select',
    child: {
      type: 'el-option',
      options: [
        {
          label: 'left',
          value: 'left'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'right',
          value: 'right'
        }
      ]
    }
  },
  {
    prop: 'operation'
  }
])

//component data
const componentData = computed(() => {
  return {
    data: tableData.map((item) => ({ ...item, draggable: true })),
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
  tableData.splice(index + 1, 0, {
    prop: '',
    label: '',
    width: '',
    sortable: false,
    fixed: false,
    align: 'left'
  })
}
const handleRemoveRow = (index, row) => {
  console.log('handleRemoveRow', index, row)
  tableData.splice(index, 1)
}

//提交结果
const handleSubmit = () => {
  //TODO: 数据校验
  emit('submit', toRaw(tableData))
  console.log('tableData', tableData)
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.sortable-ghost {
  opacity: 0.4;
  background-color: #f4e2c9;
}
</style>
