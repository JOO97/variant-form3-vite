<template>
  <el-form-item :label="i18nt('designer.setting.color')">
    <el-color-picker size="large" v-model="optionModel.color"></el-color-picker>
  </el-form-item>
</template>

<script>
import i18n from '@/utils/i18n'

export default {
  name: 'color-editor',
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object
  }
}
</script>

<style lang="scss" scoped></style>
