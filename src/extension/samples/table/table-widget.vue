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
          <template #default="{ row, $index }">
            <el-button
              v-for="btn in operations.list"
              :key="btn.name"
              :type="btn.type"
              :size="btn.size"
              :circle="btn.circle"
              @click="handleOperationBtnClick(btn.name, $index, row)"
              >{{ btn.label }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end">
        <el-pagination
          style="margin-top: 15px"
          background
          layout="total,sizes,prev, pager, next"
          v-model="currentPage"
          :page-size="pageSize"
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

const Request = axios.create()

export default {
  name: 'table-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  components: {
    StaticContentWrapper
  },
  inject: ['onOperationClick'],
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
      pageSize: 10,
      currentPage: 1
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
      const { columns: columnsStr } = this.field.options
      let r = ''
      try {
        const columns = JSON.parse(columnsStr)
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
    //是否使用数据源
    'field.options.use-data-source': {
      handler(nVal) {
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
    },
    //表格的静态数据变化
    'field.options.data'(nVal) {
      if (this.field.options['use-data-source']) return
      this.data = JSON.parse(nVal)
    },
    'field.options.data-source': {
      handler(nVal) {
        if (!this.field.options['use-data-source']) return
        this.reqData()
      }
    },
    'field.options.onMounted': {
      handler(nVal) {
        // console.log('watch', nVal)
        // if (!!nVal) this.handleOnMounted()
      },
      immediate: true
    }
  },
  created() {
    this.registerToRefList()
    this.initEventHandler()

    this.handleOnCreated()
  },
  mounted() {
    this.handleOnMounted()
  },
  beforeUnmount() {
    // this.unregisterFromRefList()
  },
  methods: {
    /**
     * 获取表单数据
     */
    reqData() {
      this.ElMessage = ElMessage
      if (!this.field.options['use-data-source']) return
      let {
        'data-source': { request, onBeforeRequest, onAfterResponse }
      } = this.field.options
      if (onBeforeRequest) {
        //请求拦截
        Request.interceptors.request.handlers = []
        Request.interceptors.request.use(
          (config) => {
            const beforeRequestFn = new Function('config', onBeforeRequest)
            return (request = beforeRequestFn.call(this, config))
          },
          (error) => {
            console.log(error) //调试用
            return Promise.reject(error)
          }
        )
      }
      if (onAfterResponse) {
        //响应拦截
        Request.interceptors.response.handlers = []
        Request.interceptors.response.use(
          (response) => {
            // const afterResponseFn = new Function('response', onAfterResponse)
            return response.data
          },
          (error) => {
            return Promise.reject(error)
          }
        )
      }
      let {
        params: paramsStr,
        data: dataStr,
        url,
        method,
        headers = '{}'
      } = request
      const data = {}
      if (method === 'POST' && dataStr) {
        const dataObj = JSON.parse(dataStr)
        Object.keys(dataObj).forEach((key) => {
          let value = dataObj[key]
          if (value.indexOf(':') !== -1) {
            const tempValue = this[value.replace(':', '')]
            if (tempValue !== undefined) data[key] = tempValue
            else this.$message.error(`${value.replace(':', '')} is undefined`)
          } else {
            data[key] = value
          }
        })
      }
      if (paramsStr) {
        const paramsArr = []
        const params = JSON.parse(paramsStr)
        Object.keys(params).forEach((key, index) => {
          let value = params[key]
          if (value.indexOf(':') !== -1) {
            const tempValue = this[value.replace(':', '')]
            if (tempValue !== undefined) value = tempValue
            else {
              delete params[key]
              this.$message.error(`${value.replace(':', '')} is undefined`)
              // return
            }
          }
          paramsArr.push(`${key}=${value}`)
        })
        url += `?${paramsArr.join('&')}`
      }
      Request({
        url,
        method,
        data,
        headers: JSON.parse(headers)
      }).then((res) => {
        if (res) this.data = res
        // else
        //   ElMessage.error({
        //     dangerouslyUseHTMLString: true,
        //     message: `<strong>${status}: </strong><span>${statusText}</span>`
        //   })
      })
    },
    /**
     * 点击操作按钮
     */
    handleOperationBtnClick(btnName, index, row) {
      this.onOperationClick({ btnName, index, row })
      if (!!this.field.options.onOperationButtonClick) {
        let fn = new Function(
          'buttonName',
          'rowIndex',
          'row',
          this.field.options.onOperationButtonClick
        )
        fn.call(this, btnName, index, row)
      }
    },
    /**
     * 改变pageSize
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      if (!!this.field.options.onPageSizeChange) {
        let fn = new Function(
          'pageSize',
          'currentPage',
          this.field.options.onPageSizeChange
        )
        fn.call(this, pageSize, this.currentPage)
      }
      this.handlePageCurrentChange(1)
    },
    /**
     * 改变当前pageNum
     */
    handlePageCurrentChange(pageNum) {
      this.currentPage = pageNum
      if (!!this.field.options.onCurrentPageChange) {
        let fn = new Function(
          'pageSize',
          'currentPage',
          this.field.options.onCurrentPageChange
        )
        fn.call(this, this.pageSize, pageNum)
      }
      this.reqData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
