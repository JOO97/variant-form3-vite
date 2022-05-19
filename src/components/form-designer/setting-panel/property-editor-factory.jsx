/**
 * 生成属性对应表单
 */
import { translate } from '@/utils/i18n'
import emitter from '@/utils/emitter'
import { optionExists } from '@/utils/util'

import dataEditor from '@/components/form-designer/setting-panel/property-editor/table/data-editor.vue'
import columnsEditor from '@/components/form-designer/setting-panel/property-editor/table/columns-editor.vue'
import dataSourceEditor from '@/components/form-designer/setting-panel/property-editor/table/data-source-editor.vue'

export const createInputTextEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-input type="text" v-model={this.optionModel[propName]} />
        </el-form-item>
      )
    }
  }
}

export const createInputNumberEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    methods: {
      updateValue(newValue) {
        if (newValue === undefined || newValue === null || isNaN(newValue)) {
          this.optionModel[propName] = null
        } else {
          this.optionModel[propName] = Number(newValue)
        }
      }
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-input-number
            type="text"
            v-model={this.optionModel[propName]}
            onChange={this.updateValue}
            style="width: 100%"
          />
        </el-form-item>
      )
    }
  }
}

export const createBooleanEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-switch v-model={this.optionModel[propName]} />
        </el-form-item>
      )
    }
  }
}

export const createCheckboxGroupEditor = function (
  propName,
  propLabelKey,
  configs
) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-checkbox-group v-model={this.optionModel[propName]}>
            {configs.optionItems.map((item) => {
              return <el-checkbox label={item.value}>{item.label}</el-checkbox>
            })}
          </el-checkbox-group>
        </el-form-item>
      )
    }
  }
}

export const createRadioGroupEditor = function (
  propName,
  propLabelKey,
  configs
) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-radio-group v-model={this.optionModel[propName]}>
            {configs.optionItems.map((item) => {
              return <el-radio label={item.value}>{item.label}</el-radio>
            })}
          </el-radio-group>
        </el-form-item>
      )
    }
  }
}

export const createRadioButtonGroupEditor = function (
  propName,
  propLabelKey,
  configs
) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-radio-group v-model={this.optionModel[propName]}>
            {configs.optionItems.map((item) => {
              return (
                <el-radio-button label={item.value}>
                  {item.label}
                </el-radio-button>
              )
            })}
          </el-radio-group>
        </el-form-item>
      )
    }
  }
}

export const createSelectEditor = function (propName, propLabelKey, configs) {
  return {
    props: {
      optionModel: Object
    },
    render(h) {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-select v-model={this.optionModel[propName]}>
            {configs.optionItems.map((item) => {
              return <el-option label={item.label} value={item.value} />
            })}
          </el-select>
        </el-form-item>
      )
    }
  }
}

export const createEventHandlerEditor = function (eventPropName, eventParams) {
  return {
    props: {
      optionModel: Object
    },
    mixins: [emitter],
    methods: {
      editEventHandler() {
        this.dispatch('SettingPanel', 'editEventHandler', [
          eventPropName,
          [...eventParams]
        ])
      }
    },
    render(h) {
      return (
        <el-form-item label={eventPropName} label-width="150px">
          <el-button
            type="info"
            icon="el-icon-edit"
            plain
            round
            onClick={this.editEventHandler}
          >
            {translate('designer.setting.addEventHandler')}
          </el-button>
        </el-form-item>
      )
    }
  }
}

export const createEmptyEditor = function () {
  return {
    render() {
      return <div style="display: none" />
    }
  }
}

//color picker
export const createColorEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render() {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <el-color-picker
            show-alpha
            v-model={this.optionModel[propName]}
            size="large"
          />
        </el-form-item>
      )
    }
  }
}

//表格静态数据编辑器
export const createDataEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render() {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <dataEditor
            optionModel={this.optionModel}
            onSubmit={(data) => {
              console.log('data', data)
              this.optionModel.data = data
            }}
          />
        </el-form-item>
      )
    }
  }
}

//表格列编辑器
export const createColumnsEditor = function (propName, propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render() {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <columnsEditor
            data={JSON.parse(this.optionModel.columns)}
            onSubmit={(columns) => {
              this.optionModel.columns = JSON.stringify(columns)
            }}
          />
        </el-form-item>
      )
    }
  }
}

//表格数据源编辑器
export const createDataSourceEditor = function (propLabelKey) {
  return {
    props: {
      optionModel: Object
    },
    render() {
      return (
        <el-form-item label={translate(propLabelKey)}>
          <dataSourceEditor
            optionModel={this.optionModel}
            onSubmit={(options) => {
              this.optionModel['data-source'] = JSON.parse(options)
            }}
          />
        </el-form-item>
      )
    }
  }
}
