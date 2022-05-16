<template>
  <div class="columns-editor">
    <el-button
      type="primary"
      :icon="Edit"
      circle
      @click="dialogVisible = true"
    />
    <el-dialog v-model="dialogVisible" title="表格列编辑">
      <!-- <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150" />
        <el-table-column property="name" label="Name" width="200" />
        <el-table-column property="address" label="Address" />
      </el-table> -->
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue'
import { Edit } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array
  }
})

// const tableColumns =

//对话框
const dialogVisible = ref(false)
</script>

<style lang="scss" scoped></style>
