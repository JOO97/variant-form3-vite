<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="Edit"
      circle
      @click="dialogVisible = true"
    />
    <el-dialog v-model="dialogVisible" title="表格列编辑" draggable>
      <el-table v-bind="componentData">
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
                @change="handleFormItemChange"
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
            <template>
              <i class="iconfont icon-drag drag-option drag-handle" />
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
      <!-- <draggable
        tag="el-table"
        :list="tableColumns"
        @start="dragging = true"
        @end="dragging = false"
        :component-data="componentData"
        item-key="prop"
        v-bind="{ group: 'dragGroup', ghostClass: 'ghost', animation: 300 }"
      >
        <template #item="{ element: option, index: idx }">
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
                @change="handleFormItemChange"
              >
                <template v-if="option.child">
                  <component
                    :is="option.child.type"
                    v-for="child in option.child.options"
                    :key="child.value + idx"
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
            <template #default="scope">
              <i class="iconfont icon-drag drag-option drag-handle" />
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
      </draggable> -->
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
import { ref, computed, reactive, toRaw } from 'vue'
import { Edit, Plus, Minus } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array
  }
})

const emit = defineEmits(['submit'])

//表格数据
const tableData = reactive(props.data.map((item) => item))

//列
const tableColumns = reactive([
  {
    type: 'index',
    prop: 'index'
  },
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

//对话框
const dialogVisible = ref(false)

//drag
const dragging = ref(false)
const dragEnabled = ref(true)

//增加、移除行
const handleAddRow = (index, row) => {
  console.log('handleAddRow', index, row)
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
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped></style>
