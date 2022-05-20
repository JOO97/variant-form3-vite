<template>
  <div>
    <VFormRender
      ref="formRender"
      :form-json="data.listJson"
      :form-data="data.formData"
      :preview-state="true"
      :option-data="data.optionData"
      @appendButtonClick="appendButtonClick"
      @buttonClick="buttonClick"
      @formChange="handleFormChange"
      @tableOperation="handleTableOperation"
    >
    </VFormRender>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import VFormRender from '@/components/form-render/index'
import axios from 'axios'

const data = reactive({
  listJson: {
    widgetList: [],
    formConfig: {}
  },
  formData: {},
  optionData: {},
  formJson: {}
})

const formRender = ref(null)
axios
  .get(
    'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/listScheme'
  )
  .then((res) => {
    if (res.status === 200) {
      data.listJson = res.data
      formRender.value.setFormJson(res.data)
    }
  })

watch(
  () => data.formJson,
  (nVal) => {
    const table = formRender.value.getWidgetRef('table')
    console.log('table', table)
    table.setColumnsByScheme(nVal)
  },
  {
    deep: true
  }
)

const appendButtonClick = (clickedWidget) => {
  console.log('appendButtonClick', clickedWidget)
}
const buttonClick = (button) => {
  console.log('button click', button)
}
const handleFormChange = (fieldName, newValue, oldValue, formModel) => {
  console.log('FormChange', fieldName, newValue, oldValue, formModel)
}
const handleTableOperation = ({ name, eventName, payload }) => {
  console.log('handleTableOperation', name, eventName, payload)
}
</script>

<style></style>
