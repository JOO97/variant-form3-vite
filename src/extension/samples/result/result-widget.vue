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
    <el-result
      icon="success"
      title="Success Tip"
      sub-title="Please follow the instructions"
    >
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
    </el-result>
  </static-content-wrapper>
</template>

<script>
import StaticContentWrapper from '@/components/form-designer/form-widget/field-widget/static-content-wrapper'
import emitter from '@/utils/emitter'
import i18n from '@/utils/i18n'
import fieldMixin from '@/components/form-designer/form-widget/field-widget/fieldMixin'

export default {
  name: 'result-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
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
  components: {
    StaticContentWrapper
  },
  created() {
    this.registerToRefList()
    this.initEventHandler()
  },
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {
    handelCloseCustomEvent() {
      if (!!this.field.options.onClose) {
        let changeFn = new Function(this.field.options.onClose)
        changeFn.call(this)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
