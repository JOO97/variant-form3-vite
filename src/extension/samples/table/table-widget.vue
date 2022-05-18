<template>
  <static-content-wrapper
    :designer="designer"
    :field="field"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <div>
      <el-table style="width: 100%" v-bind="tableProps" :data="data">
        <template v-for="item in columns" :key="item.prop">
          <el-table-column
            v-bind="item"
            :prop="item.prop"
            :label="item.label"
            :width="item.width || ''"
          />
        </template>
        <el-table-column
          v-if="field.options['show-operation']"
          prop="operation"
          :label="operations.label"
          :width="operations.width || ''"
        >
          <template #default="scope">
            <el-button
              v-for="btn in operations.list"
              :key="btn.name"
              :type="btn.type"
              :size="btn.size"
              :circle="btn.circle"
              @click="handleOperationBtnClick"
              >{{ btn.name }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end">
        <el-pagination
          style="margin-top: 15px"
          background
          layout="prev, pager, next"
          v-model="page.current"
          :page-size="page.size"
          :total="data.length"
          v-if="usePagination"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
          @prev-click="handlePageCurrentChange"
          @next-click="handlePageCurrentChange"
        />
      </div>
    </div>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from '@/components/form-designer/form-widget/field-widget/static-content-wrapper'
import emitter from '@/utils/emitter'
import i18n from '@/utils/i18n'
import fieldMixin from '@/components/form-designer/form-widget/field-widget/fieldMixin'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'table-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  components: {
    StaticContentWrapper
  },
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */ type: Number,
      default: -1
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */ type: Number,
      default: -1
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */ type: String,
      default: ''
    }
  },
  data() {
    return {
      data: [],
      page: {
        size: 15,
        current: 1
      }
    }
  },
  computed: {
    tableProps() {
      const props = [
        'height',
        'max-height',
        'stripe',
        'border',
        'size',
        'fit',
        'show-header',
        'highlight-current-row',
        'empty-text',
        'table-layout',
        'scrollbar-always-on'
      ]
      const bindProps = {}
      props.forEach((key) => {
        const value =
          this.field.options[key === 'table-layout' ? 'layout' : key]
        if (value !== undefined && value !== null && value !== '') {
          bindProps[key] = value
        }
      })
      return bindProps
    },
    columns() {
      const {
        columns: columnsStr,
        'show-operation': showOperation,
        operations
      } = this.field.options
      let r = ''
      try {
        const columns = JSON.parse(columnsStr)
        // if (showOperation) {
        //   columns.push({
        //     prop: 'operation',
        //     ...operations
        //   })
        // }
        console.log(columns)
        r = columns
      } catch (error) {
        r = []
      }
      return r
    },
    operations() {
      return this.field.options.operations
    },
    usePagination() {
      return this.field.options.usePagination
    }
  },
  watch: {
    'field.options.use-data-source': {
      handler(nVal) {
        console.log('new', nVal)
        if (nVal) {
          this.reqData()
        } else {
          try {
            const data = JSON.parse(this.field.options.data)
            this.data = data
          } catch (error) {
            this.data = []
          }
        }
      },
      immediate: true
    }
  },

  created() {
    this.registerToRefList()
    this.initEventHandler()
  },
  mounted() {},
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {
    handelCloseCustomEvent() {
      if (!!this.field.options.onClose) {
        let changeFn = new Function(this.field.options.onClose)
        changeFn.call(this)
      }
    },
    /**
     * 获取表单数据
     */
    reqData() {
      if (!this.field.options['use-data-source']) return
      let {
        'data-source': { request, beforeRequest, afterRequest }
      } = this.field.options
      if (beforeRequest) {
        const beforeRequestFn = new Function('req', beforeRequest)
        request = beforeRequestFn.call(this, request)
      }
      axios
        .request({
          url: request.url,
          method: request.method
        })
        .then(({ status, statusText, data }) => {
          if (status === 200) {
            if (afterRequest) {
              const afterRequestFn = new Function('res', afterRequest)
              data = afterRequestFn.call(this, data)
              this.data = data
            }
          } else {
            ElMessage.error({
              dangerouslyUseHTMLString: true,
              message: `<strong>${status}: </strong><span>${statusText}</span>`
            })
          }
        })
    },
    /**
     * TODO:点击操作按钮
     */
    handleOperationBtnClick(fnStr) {
      if (fnStr) {
        const fn = new Function('', fnStr)
        fn.call(this)
      }
    },
    //TODO: pagination---------------------------
    handlePageSizeChange(pageSize) {},
    handlePageCurrentChange(pageNum) {}
  }
}
</script>

<style lang="scss" scoped></style>
