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
      <el-table
        style="width: 100%"
        v-bind="tableProps"
        :data="data"
        ref="tableWidget"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="item.prop + index"
          v-bind="item"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
        />
        <el-table-column
          v-if="field.options['show-operation']"
          prop="operation"
          :label="operations.label"
          :width="operations.width || ''"
        >
          <template #default="{ row, $index }">
            <template v-for="btn in operations.list" :key="btn.name">
              <el-button
                v-if="btn.visible"
                v-bind="btn"
                @click="handleOperationBtnClick(btn, $index, row)"
                >{{ btn.label }}</el-button
              >
            </template>
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
          :total="total"
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
  props: {
    formModel: Object,
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
    },
    tableFieldScheme: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      data: [],
      columns: [],
      pageSize: 10,
      currentPage: 1,
      total: 0
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
        if (this.formModel && this.formModel[this.field.options.name]) {
          this.data = this.formModel[this.field.options.name]
          return
        }
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
    formModel: {
      handler(nVal) {
        if (this.formModel && this.formModel[this.field.options.name]) {
          this.data = this.formModel[this.field.options.name]
          return
        }
      },
      deep: true
    },
    //表格的静态数据变化
    'field.options.data'(nVal) {
      if (this.field.options['use-data-source']) return
      this.data = JSON.parse(nVal)
    },
    'field.options.columns': {
      handler(nVal) {
        let r = ''
        try {
          const columns = JSON.parse(nVal)
          r = columns
        } catch (error) {
          r = []
        }
        this.columns = r
      },
      immediate: true
    },
    'field.options.data-source': {
      handler(nVal) {
        if (!this.field.options['use-data-source']) return
        this.reqData()
      }
    },
    tableFieldScheme: {
      handler(nVal) {
        if (nVal && nVal[this.field.options.name]) {
          this.mapFormSchemeToColumns(nVal[this.field.options.name])
          // [
          //   {
          //     prop: 'id',
          //     label: 'ID',
          //     width: '100',
          //     sortable: true,
          //     fixed: false,
          //     align: 'left'
          //   }
          // ]
        }
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
        if (res) {
          this.data = res
        }
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
    handleOperationBtnClick({ name, emit }, index, row) {
      if (emit) {
        this.dispatch('VFormRender', 'tableOperation', {
          name: this.field.options.name,
          eventName: 'operation-btn-click',
          payload: {
            name,
            index,
            row
          }
        })
      }
      if (!!this.field.options.onOperationButtonClick) {
        let fn = new Function(
          'buttonName',
          'rowIndex',
          'row',
          this.field.options.onOperationButtonClick
        )
        fn.call(this, name, index, row)
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
    },
    /**
     * 根据form scheme生成表头字段
     */
    mapFormSchemeToColumns({ widgetList: scheme }) {
      const formList = []
      const mapWidgets = (list) => {
        list.map((item) => {
          const { cols, formItemFlag, category, widgetList } = item
          if (formItemFlag && category !== 'container') {
            formList.push(item)
          } else if (widgetList) {
            mapWidgets(widgetList)
          } else if (cols) {
            mapWidgets(cols)
          }
        })
      }
      mapWidgets(scheme)
      const columns = formList.map(({ options }) => {
        const { label, name: prop, labelAlign: align } = options
        return {
          prop,
          label,
          align: align ? align : 'left',
          width: '',
          sortable: false,
          fixed: false,
          formCfg: options
        }
      })
      return columns
    },

    //重写组件的公共方法------------------------------
    /**
     * 获取table data
     */
    getValue() {
      return this.data
    },
    /**
     * 设置table data
     * @param {Array} data 数据
     */
    setValue(data) {
      //TODO: optionData映射给data
      // const formCfg = {}
      // if (data && data.length) {
      //   Object.keys(data[0]).forEach((key) => {
      //     const column = this.columns.find(
      //       ({ prop, formOptions = {} }) => prop === key
      //     )
      //     formCfg[key] = column
      //   })
      // }
      // console.log('formCfg', formCfg)
      this.data = data.map((item) => {
        return item
      })
    },
    /**
     * 获取table columns
     */
    getColumns() {
      return this.columns
    },
    /**
     * 设置table columns
     * @param {Array} columns
     */
    setColumns(columns) {
      this.columns = columns
    },
    /**
     * 设置table columns通过scheme
     * @param {Array} columns
     */
    setColumnsByScheme(scheme) {
      const columns = this.mapFormSchemeToColumns(scheme)
      this.setColumns(columns)
    },
    /**
     * 设置操作按钮的可见性
     * @param {string} btnName 按钮名称
     * @param {boolean} visible 状态 (为null的话，将当前状态取反)
     */
    setOperationBtnVisible(btnName, visible = null) {
      const { list } = this.field.options.operations
      list.forEach((item) => {
        if (item.name === btnName) {
          if (visible === null) {
            item.visible = !item.visible
          } else {
            item.visible = visible
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
