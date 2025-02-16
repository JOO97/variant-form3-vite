<template>
  <div class="toolbar-container">
    <div class="left-toolbar">
      <el-button
        :disabled="undoDisabled"
        :title="i18nt('designer.toolbar.undoHint')"
        @click="undoHistory"
      >
        <svg-icon icon-class="undo"
      /></el-button>
      <el-button
        :disabled="redoDisabled"
        :title="i18nt('designer.toolbar.redoHint')"
        @click="redoHistory"
      >
        <svg-icon icon-class="redo"
      /></el-button>
      <el-button-group style="margin-left: 20px">
        <el-button
          :type="layoutType === 'PC' ? 'info' : ''"
          @click="changeLayoutType('PC')"
        >
          {{ i18nt('designer.toolbar.pcLayout') }}</el-button
        >
        <el-button
          :type="layoutType === 'Pad' ? 'info' : ''"
          @click="changeLayoutType('Pad')"
        >
          {{ i18nt('designer.toolbar.padLayout') }}</el-button
        >
        <el-button
          :type="layoutType === 'H5' ? 'info' : ''"
          @click="changeLayoutType('H5')"
        >
          {{ i18nt('designer.toolbar.mobileLayout') }}</el-button
        >
      </el-button-group>
      <el-button
        style="margin-left: 20px"
        :title="i18nt('designer.toolbar.nodeTreeHint')"
        @click="showNodeTreeDrawer"
      >
        <svg-icon icon-class="node-tree"
      /></el-button>
    </div>

    <el-drawer
      :title="i18nt('designer.toolbar.nodeTreeTitle')"
      direction="ltr"
      v-model="showNodeTreeDrawerFlag"
      :modal="true"
      :size="280"
      :destroy-on-close="true"
      custom-class="node-tree-drawer"
    >
      <el-tree
        ref="nodeTree"
        :data="nodeTreeData"
        node-key="id"
        default-expand-all
        highlight-current
        class="node-tree"
        icon-class="el-icon-arrow-right"
        @node-click="onNodeTreeClick"
      ></el-tree>
    </el-drawer>

    <div class="right-toolbar" :style="{ width: toolbarWidth + 'px' }">
      <div class="right-toolbar-con">
        <el-button
          v-if="showToolButton('clearDesignerButton')"
          @click="clearFormWidget"
        >
          <svg-icon icon-class="el-delete" />{{
            i18nt('designer.toolbar.clear')
          }}</el-button
        >
        <el-button
          v-if="showToolButton('previewFormButton')"
          @click="previewForm"
        >
          <svg-icon icon-class="el-view" />{{
            i18nt('designer.toolbar.preview')
          }}</el-button
        >
        <el-button
          v-if="showToolButton('importJsonButton')"
          @click="importJson"
        >
          {{ i18nt('designer.toolbar.importJson') }}</el-button
        >
        <el-button
          v-if="showToolButton('exportJsonButton')"
          @click="exportJson"
        >
          {{ i18nt('designer.toolbar.exportJson') }}</el-button
        >
        <el-button
          v-if="showToolButton('exportCodeButton')"
          @click="exportCode"
        >
          {{ i18nt('designer.toolbar.exportCode') }}</el-button
        >
        <el-button
          v-if="showToolButton('generateSFCButton')"
          @click="generateSFC"
        >
          <svg-icon icon-class="vue-sfc" />{{
            i18nt('designer.toolbar.generateSFC')
          }}</el-button
        >
        <template v-for="(idx, slotName) in $slots">
          <slot :name="slotName"></slot>
        </template>
      </div>
    </div>

    <div
      v-if="showPreviewDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.preview')"
        v-model="showPreviewDialogFlag"
        :show-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        center
        :destroy-on-close="true"
        custom-class="drag-dialog small-padding-dialog"
        width="75%"
        :fullscreen="layoutType === 'H5' || layoutType === 'Pad'"
      >
        <div>
          <div>
            <el-button @click="test">testTable</el-button>
          </div>
          <div
            class="form-render-wrapper"
            :class="[
              layoutType === 'H5'
                ? 'h5-layout'
                : layoutType === 'Pad'
                ? 'pad-layout'
                : ''
            ]"
          >
            <VFormRender
              ref="preForm"
              :form-json="formJson"
              :form-data="testFormData"
              :preview-state="true"
              :option-data="testOptionData"
              @appendButtonClick="testOnAppendButtonClick"
              @buttonClick="testOnButtonClick"
              @formChange="handleFormChange"
              @tableOperation="handleTableOperation"
            >
            </VFormRender>
          </div>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="getFormData">{{
              i18nt('designer.hint.getFormData')
            }}</el-button>
            <el-button type="primary" @click="resetForm">{{
              i18nt('designer.hint.resetForm')
            }}</el-button>
            <el-button type="primary" @click="setFormDisabled">{{
              i18nt('designer.hint.disableForm')
            }}</el-button>
            <el-button type="primary" @click="setFormEnabled">{{
              i18nt('designer.hint.enableForm')
            }}</el-button>
            <el-button @click="showPreviewDialogFlag = false">{{
              i18nt('designer.hint.closePreview')
            }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showImportJsonDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.importJson')"
        v-model="showImportJsonDialogFlag"
        :show-close="true"
        custom-class="drag-dialog small-padding-dialog"
        :append-to-body="true"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-alert
          type="info"
          :title="i18nt('designer.hint.importJsonHint')"
          show-icon
          class="alert-padding"
        ></el-alert>
        <code-editor
          :mode="'json'"
          :readonly="false"
          v-model="importTemplate"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="doJsonImport">
              {{ i18nt('designer.hint.import') }}</el-button
            >
            <el-button @click="showImportJsonDialogFlag = false">
              {{ i18nt('designer.hint.cancel') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showExportJsonDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.exportJson')"
        v-model="showExportJsonDialogFlag"
        :show-close="true"
        custom-class="drag-dialog small-padding-dialog"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          :mode="'json'"
          :readonly="true"
          v-model="jsonContent"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="primary"
              class="copy-json-btn"
              :data-clipboard-text="jsonRawContent"
              @click="copyFormJson"
            >
              {{ i18nt('designer.hint.copyJson') }}</el-button
            >
            <el-button @click="saveFormJson">{{
              i18nt('designer.hint.saveFormJson')
            }}</el-button>
            <el-button @click="showExportJsonDialogFlag = false">
              {{ i18nt('designer.hint.closePreview') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showExportCodeDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.exportCode')"
        v-model="showExportCodeDialogFlag"
        :show-close="true"
        custom-class="drag-dialog small-padding-dialog"
        center
        width="65%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-tabs
          type="border-card"
          class="no-box-shadow no-padding"
          v-model="activeCodeTab"
        >
          <el-tab-pane label="Vue" name="vue">
            <code-editor
              :mode="'html'"
              :readonly="true"
              v-model="vueCode"
              :user-worker="false"
            ></code-editor>
          </el-tab-pane>
          <el-tab-pane label="HTML" name="html">
            <code-editor
              :mode="'html'"
              :readonly="true"
              v-model="htmlCode"
              :user-worker="false"
            ></code-editor>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="primary"
              class="copy-vue-btn"
              :data-clipboard-text="vueCode"
              @click="copyVueCode"
            >
              {{ i18nt('designer.hint.copyVueCode') }}</el-button
            >
            <el-button
              type="primary"
              class="copy-html-btn"
              :data-clipboard-text="htmlCode"
              @click="copyHtmlCode"
            >
              {{ i18nt('designer.hint.copyHtmlCode') }}</el-button
            >
            <el-button @click="saveVueCode">{{
              i18nt('designer.hint.saveVueCode')
            }}</el-button>
            <el-button @click="saveHtmlCode">{{
              i18nt('designer.hint.saveHtmlCode')
            }}</el-button>
            <el-button @click="showExportCodeDialogFlag = false">
              {{ i18nt('designer.hint.closePreview') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showFormDataDialogFlag"
      class=""
      v-drag="[
        '.nested-drag-dialog.el-dialog',
        '.nested-drag-dialog .el-dialog__header'
      ]"
    >
      <el-dialog
        :title="i18nt('designer.hint.exportFormData')"
        v-model="showFormDataDialogFlag"
        :show-close="true"
        custom-class="nested-drag-dialog dialog-title-light-bg"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        :append-to-body="true"
      >
        <div style="border: 1px solid #dcdfe6">
          <code-editor
            :mode="'json'"
            :readonly="true"
            v-model="formDataJson"
          ></code-editor>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="primary"
              class="copy-form-data-json-btn"
              :data-clipboard-text="formDataRawJson"
              @click="copyFormDataJson"
            >
              {{ i18nt('designer.hint.copyFormData') }}</el-button
            >
            <el-button @click="saveFormData">{{
              i18nt('designer.hint.saveFormData')
            }}</el-button>
            <el-button @click="showFormDataDialogFlag = false">
              {{ i18nt('designer.hint.closePreview') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>

    <div
      v-if="showExportSFCDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.toolbar.generateSFC')"
        v-model="showExportSFCDialogFlag"
        v-if="showExportSFCDialogFlag"
        :show-close="true"
        custom-class="drag-dialog small-padding-dialog"
        center
        width="65%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <el-tabs
          type="border-card"
          class="no-box-shadow no-padding"
          v-model="activeSFCTab"
        >
          <el-tab-pane label="Vue2" name="vue2">
            <code-editor
              :mode="'html'"
              :readonly="true"
              v-model="sfcCode"
              :user-worker="false"
            ></code-editor>
          </el-tab-pane>
          <el-tab-pane label="Vue3" name="vue3">
            <code-editor
              :mode="'html'"
              :readonly="true"
              v-model="sfcCodeV3"
              :user-worker="false"
            ></code-editor>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="primary"
              class="copy-vue2-sfc-btn"
              :data-clipboard-text="sfcCode"
              @click="copyV2SFC"
            >
              {{ i18nt('designer.hint.copyVue2SFC') }}</el-button
            >
            <el-button
              type="primary"
              class="copy-vue3-sfc-btn"
              :data-clipboard-text="sfcCodeV3"
              @click="copyV3SFC"
            >
              {{ i18nt('designer.hint.copyVue3SFC') }}</el-button
            >
            <el-button @click="saveV2SFC">{{
              i18nt('designer.hint.saveVue2SFC')
            }}</el-button>
            <el-button @click="saveV3SFC">{{
              i18nt('designer.hint.saveVue3SFC')
            }}</el-button>
            <el-button @click="showExportSFCDialogFlag = false">
              {{ i18nt('designer.hint.closePreview') }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import VFormRender from '@/components/form-render/index'
import CodeEditor from '@/components/code-editor/index'
import Clipboard from 'clipboard'
import {
  deepClone,
  copyToClipboard,
  generateId,
  getQueryParam,
  traverseAllWidgets,
  addWindowResizeHandler
} from '@/utils/util'
import i18n from '@/utils/i18n'
import { generateCode } from '@/utils/code-generator'
import { genSFC } from '@/utils/sfc-generator'
import loadBeautifier from '@/utils/beautifierLoader'
import { saveAs } from 'file-saver'
import axios from 'axios'

export default {
  name: 'ToolbarPanel',
  mixins: [i18n],
  components: {
    VFormRender,
    CodeEditor,
    Clipboard
  },
  props: {
    designer: Object
  },
  inject: ['getDesignerConfig'],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      toolbarWidth: 420,
      showPreviewDialogFlag: false,
      showImportJsonDialogFlag: false,
      showExportJsonDialogFlag: false,
      showExportCodeDialogFlag: false,
      showFormDataDialogFlag: false,
      showExportSFCDialogFlag: false,
      showNodeTreeDrawerFlag: false,

      nodeTreeData: [],

      importTemplate: '',
      jsonContent: '',
      jsonRawContent: '',

      formDataJson: '',
      formDataRawJson: '',

      vueCode: '',
      htmlCode: '',

      sfcCode: '',
      sfcCodeV3: '',

      activeCodeTab: 'vue',
      activeSFCTab: 'vue2',

      testFormData: {
        id: 10001,
        name: '张三',
        timeRange: [1],
        phone: '13295923180',
        address: '厦门市',
        deliveryTime: ['14:06:58', '15:06:58'],
        price: null,
        info: '123'
      },

      testOptionData: {
        select62173: [
          { label: '01', value: 1 },
          { label: '22', value: 2 },
          { label: '333', value: 3 }
        ]
      }
    }
  },
  computed: {
    formJson() {
      return {
        widgetList: deepClone(this.designer.widgetList),
        formConfig: deepClone(this.designer.formConfig)
      }
    },

    undoDisabled() {
      return !this.designer.undoEnabled()
    },

    redoDisabled() {
      return !this.designer.redoEnabled()
    },

    layoutType() {
      return this.designer.getLayoutType()
    }
  },
  watch: {
    'designer.widgetList': {
      deep: true,
      handler(val) {
        //console.log('test-----', val)
        //this.refreshNodeTree()
      }
    }
  },
  mounted() {
    let maxTBWidth = this.designerConfig.toolbarMaxWidth || 420
    let minTBWidth = this.designerConfig.toolbarMinWidth || 300
    let newTBWidth = window.innerWidth - 260 - 300 - 320 - 80
    this.toolbarWidth =
      newTBWidth >= maxTBWidth
        ? maxTBWidth
        : newTBWidth <= minTBWidth
        ? minTBWidth
        : newTBWidth
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        let newTBWidth2 = window.innerWidth - 260 - 300 - 320 - 80
        this.toolbarWidth =
          newTBWidth2 >= maxTBWidth
            ? maxTBWidth
            : newTBWidth2 <= minTBWidth
            ? minTBWidth
            : newTBWidth2
      })
    })
  },
  methods: {
    showToolButton(configName) {
      if (this.designerConfig[configName] === undefined) {
        return true
      }

      return !!this.designerConfig[configName]
    },

    buildTreeNodeOfWidget(widget, treeNode) {
      let curNode = {
        id: widget.id,
        label: widget.options.label || widget.type
        //selectable: true,
      }
      treeNode.push(curNode)

      if (widget.category === undefined) {
        return
      }

      curNode.children = []
      if (widget.type === 'grid') {
        widget.cols.map((col) => {
          let colNode = {
            id: col.id,
            label: col.options.name || widget.type,
            children: []
          }
          curNode.children.push(colNode)
          col.widgetList.map((wChild) => {
            this.buildTreeNodeOfWidget(wChild, colNode.children)
          })
        })
      } else if (widget.type === 'table') {
        //TODO: 需要考虑合并单元格！！
        widget.rows.map((row) => {
          let rowNode = {
            id: row.id,
            label: 'table-row',
            selectable: false,
            children: []
          }
          curNode.children.push(rowNode)

          row.cols.map((cell) => {
            if (!!cell.merged) {
              //跳过合并单元格！！
              return
            }

            let rowChildren = rowNode.children
            let cellNode = {
              id: cell.id,
              label: 'table-cell',
              children: []
            }
            rowChildren.push(cellNode)

            cell.widgetList.map((wChild) => {
              this.buildTreeNodeOfWidget(wChild, cellNode.children)
            })
          })
        })
      } else if (widget.type === 'tab') {
        widget.tabs.map((tab) => {
          let tabNode = {
            id: tab.id,
            label: tab.options.name || widget.type,
            selectable: false,
            children: []
          }
          curNode.children.push(tabNode)
          tab.widgetList.map((wChild) => {
            this.buildTreeNodeOfWidget(wChild, tabNode.children)
          })
        })
      } else if (widget.type === 'sub-form') {
        widget.widgetList.map((wChild) => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      } else if (widget.category === 'container') {
        //自定义容器
        widget.widgetList.map((wChild) => {
          this.buildTreeNodeOfWidget(wChild, curNode.children)
        })
      }
    },

    refreshNodeTree() {
      this.nodeTreeData.length = 0
      this.designer.widgetList.forEach((wItem) => {
        this.buildTreeNodeOfWidget(wItem, this.nodeTreeData)
      })
    },

    showNodeTreeDrawer() {
      this.refreshNodeTree()
      this.showNodeTreeDrawerFlag = true
      this.$nextTick(() => {
        if (!!this.designer.selectedId) {
          //同步当前选中组件到节点树！！！
          this.$refs.nodeTree.setCurrentKey(this.designer.selectedId)
        }
      })
    },

    undoHistory() {
      this.designer.undoHistoryStep()
    },

    redoHistory() {
      this.designer.redoHistoryStep()
    },

    changeLayoutType(newType) {
      this.designer.changeLayoutType(newType)
    },

    clearFormWidget() {
      this.designer.clearDesigner()
    },

    previewForm() {
      this.showPreviewDialogFlag = true
    },

    saveAsFile(fileContent, defaultFileName) {
      this.$prompt(
        this.i18nt('designer.hint.fileNameForSave'),
        this.i18nt('designer.hint.saveFileTitle'),
        {
          inputValue: defaultFileName,
          closeOnClickModal: false,
          inputPlaceholder: this.i18nt('designer.hint.fileNameInputPlaceholder')
        }
      )
        .then(({ value }) => {
          if (!value) {
            value = defaultFileName
          }

          if (getQueryParam('vscode') == 1) {
            this.vsSaveFile(value, fileContent)
            return
          }

          const fileBlob = new Blob([fileContent], {
            type: 'text/plain;charset=utf-8'
          })
          saveAs(fileBlob, value)
        })
        .catch(() => {
          //
        })
    },

    vsSaveFile(fileName, fileContent) {
      const msgObj = {
        cmd: 'writeFile',
        data: {
          fileName,
          code: fileContent
        }
      }
      window.parent.postMessage(msgObj, '*')
    },

    importJson() {
      this.importTemplate = JSON.stringify(
        this.designer.getImportTemplate(),
        null,
        '  '
      )
      this.showImportJsonDialogFlag = true
    },

    doJsonImport() {
      try {
        let importObj = JSON.parse(this.importTemplate)
        //console.log('test import', this.importTemplate)
        if (!importObj || !importObj.formConfig) {
          throw new Error(this.i18nt('designer.hint.invalidJsonFormat'))
        }

        let fJsonVer = importObj.formConfig.jsonVersion
        if (!fJsonVer || fJsonVer !== 3) {
          throw new Error(this.i18nt('designer.hint.jsonVersionMismatch'))
        }

        this.designer.loadFormJson(importObj)

        this.showImportJsonDialogFlag = false
        this.$message.success(this.i18nt('designer.hint.importJsonSuccess'))

        this.designer.emitHistoryChange()

        this.designer.emitEvent('form-json-imported', [])
      } catch (ex) {
        this.$message.error(ex + '')
      }
    },

    exportJson() {
      let widgetList = deepClone(this.designer.widgetList)
      let formConfig = deepClone(this.designer.formConfig)
      this.jsonContent = JSON.stringify({ widgetList, formConfig }, null, '  ')
      this.jsonRawContent = JSON.stringify({ widgetList, formConfig })
      this.showExportJsonDialogFlag = true
    },

    copyFormJson(e) {
      copyToClipboard(
        this.jsonRawContent,
        e,
        this.$message,
        this.i18nt('designer.hint.copyJsonSuccess'),
        this.i18nt('designer.hint.copyJsonFail')
      )
    },

    saveFormJson() {
      this.saveAsFile(this.jsonContent, `vform${generateId()}.json`)
    },

    exportCode() {
      this.vueCode = generateCode(this.formJson)
      this.htmlCode = generateCode(this.formJson, 'html')
      this.showExportCodeDialogFlag = true
    },

    copyVueCode(e) {
      copyToClipboard(
        this.vueCode,
        e,
        this.$message,
        this.i18nt('designer.hint.copyVueCodeSuccess'),
        this.i18nt('designer.hint.copyVueCodeFail')
      )
    },

    copyHtmlCode(e) {
      copyToClipboard(
        this.htmlCode,
        e,
        this.$message,
        this.i18nt('designer.hint.copyHtmlCodeSuccess'),
        this.i18nt('designer.hint.copyHtmlCodeFail')
      )
    },

    saveVueCode() {
      this.saveAsFile(this.vueCode, `vform${generateId()}.vue`)
    },

    saveHtmlCode() {
      this.saveAsFile(this.htmlCode, `vform${generateId()}.html`)
    },

    generateSFC() {
      loadBeautifier((beautifier) => {
        this.sfcCode = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier
        )
        this.sfcCodeV3 = genSFC(
          this.designer.formConfig,
          this.designer.widgetList,
          beautifier,
          true
        )
        this.showExportSFCDialogFlag = true
      })
    },

    copyV2SFC(e) {
      copyToClipboard(
        this.sfcCode,
        e,
        this.$message,
        this.i18nt('designer.hint.copySFCSuccess'),
        this.i18nt('designer.hint.copySFCFail')
      )
    },

    copyV3SFC(e) {
      copyToClipboard(
        this.sfcCodeV3,
        e,
        this.$message,
        this.i18nt('designer.hint.copySFCSuccess'),
        this.i18nt('designer.hint.copySFCFail')
      )
    },

    saveV2SFC() {
      this.saveAsFile(this.sfcCode, `vformV2-${generateId()}.vue`)
    },

    saveV3SFC() {
      this.saveAsFile(this.sfcCodeV3, `vformV3-${generateId()}.vue`)
    },

    getFormData() {
      this.$refs['preForm']
        .getFormData()
        .then((formData) => {
          this.formDataJson = JSON.stringify(formData, null, '  ')
          this.formDataRawJson = JSON.stringify(formData)

          this.showFormDataDialogFlag = true
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },

    copyFormDataJson(e) {
      copyToClipboard(
        this.formDataRawJson,
        e,
        this.$message,
        this.i18nt('designer.hint.copyJsonSuccess'),
        this.i18nt('designer.hint.copyJsonFail')
      )
    },

    saveFormData() {
      this.saveAsFile(this.htmlCode, `formData${generateId()}.json`)
    },

    resetForm() {
      this.$refs['preForm'].resetForm()
    },

    setFormDisabled() {
      this.$refs['preForm'].disableForm()
    },

    setFormEnabled() {
      this.$refs['preForm'].enableForm()
    },

    testLoadForm() {
      axios
        .get(
          'https://www.fastmock.site/mock/e9710039bb5f11262d1a0f2f0bbe08c8/vform3/getFS'
        )
        .then((res) => {
          let newFormJson = res.data
          this.$refs.preForm.setFormJson(newFormJson)
          this.$nextTick(() => {
            let newFormData = { input30696: '668899' }
            this.$refs.preForm.setFormData(newFormData)
          })
        })
        .catch((err) => {
          //
        })
    },

    testSetFormJson() {
      let newFormJson = {
        widgetList: [
          {
            key: 50043,
            type: 'static-text',
            icon: 'static-text',
            formItemFlag: false,
            options: {
              name: 'title',
              columnWidth: '200px',
              hidden: false,
              textContent: '列表',
              customClass: [],
              onCreated: '',
              onMounted: '',
              label: 'static-text'
            },
            id: 'statictext68608'
          },
          {
            key: 99874,
            type: 'divider',
            icon: 'divider',
            formItemFlag: false,
            options: {
              name: 'divider',
              label: '',
              columnWidth: '200px',
              direction: 'horizontal',
              contentPosition: 'center',
              hidden: false,
              customClass: [],
              onCreated: '',
              onMounted: ''
            },
            id: 'divider44861'
          },
          {
            key: 33055,
            type: 'table',
            icon: 'table',
            formItemFlag: false,
            options: {
              name: 'table',
              label: 'table',
              customClass: [],
              height: '',
              'max-height': '700',
              stripe: true,
              border: true,
              size: 'large',
              fit: true,
              'show-header': true,
              'highlight-current-row': true,
              'empty-text': 'No Data',
              layout: 'auto',
              'scrollbar-always-on': false,
              'show-operation': true,
              operations: {
                label: '操作',
                width: '200',
                list: [
                  {
                    label: '查看',
                    name: 'detail',
                    type: 'primary',
                    size: 'small',
                    circle: false,
                    disable: '',
                    visible: true,
                    plain: true
                  },
                  {
                    label: '编辑',
                    name: 'edit',
                    type: 'success',
                    size: 'small',
                    circle: false,
                    visible: true,
                    disable: '',
                    plain: true
                  },
                  {
                    label: '删除',
                    name: 'delete',
                    type: 'danger',
                    size: 'small',
                    circle: false,
                    visible: true,
                    disable: '',
                    plain: true
                  }
                ]
              },
              usePagination: true,
              columns:
                '[{"prop":"id","label":"ID","width":"","sortable":false,"fixed":false,"align":"left"}]',
              data: '[\n  ]',
              'use-data-source': false,
              'data-source': {
                type: 'api',
                name: 'table数据api',
                request: {
                  url: 'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/tableData',
                  method: 'GET',
                  headers: '{}',
                  params: '{}',
                  data: '{}'
                },
                onBeforeRequest: 'return config',
                onAfterResponse: 'return response.data'
              },
              onCreated: '',
              onMounted: '',
              onPageSizeChange: '',
              onCurrentPageChange: '',
              onOperationButtonClick: ''
            },
            id: 'table19608'
          }
        ],
        formConfig: {
          modelName: 'formData',
          refName: 'vForm',
          rulesName: 'rules',
          labelWidth: 80,
          labelPosition: 'left',
          size: '',
          labelAlign: 'label-left-align',
          cssCode: '',
          customClass: [],
          functions: '',
          layoutType: 'PC',
          jsonVersion: 3,
          onFormCreated: '',
          onFormMounted:
            "axios\r\n  .get(\r\n    'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/listScheme'\r\n  )\r\n  .then((res) => {\r\n    if (res.status === 200) {\r\n      this.setFormJson(res.data)\r\n    }\r\n  })",
          onFormDataChange: '',
          onFormValidate: ''
        }
      }
      this.$refs.preForm.setFormJson(newFormJson)
      this.$nextTick(() => {
        // this.$refs.preForm.setFormData({ input12931: 'asdf' })
      })
    },

    handleFormChange(fieldName, newValue, oldValue, formModel) {
      /*
        console.log('---formChange start---')
        console.log('fieldName', fieldName)
        console.log('newValue', newValue)
        console.log('oldValue', oldValue)
        console.log('formModel', formModel)
        console.log('---formChange end---')
        */
    },

    testOnAppendButtonClick(clickedWidget) {
      console.log('test', clickedWidget)
    },

    testOnButtonClick(button) {
      console.log('test', button)
    },

    findWidgetById(wId) {
      let foundW = null
      traverseAllWidgets(this.designer.widgetList, (w) => {
        if (w.id === wId) {
          foundW = w
        }
      })

      return foundW
    },

    onNodeTreeClick(nodeData, node, nodeEl) {
      //console.log('test', JSON.stringify(nodeData))

      if (nodeData.selectable !== undefined && !nodeData.selectable) {
        this.$message.info(
          this.i18nt('designer.hint.currentNodeCannotBeSelected')
        )
      } else {
        const selectedId = nodeData.id
        const foundW = this.findWidgetById(selectedId)
        if (!!foundW) {
          this.designer.setSelected(foundW)
        }
      }
    },
    /**
     * 监听table组件向外传递的事件
     * @param {object} payload
     * name 组件唯一名称
     * eventName 事件名称
     * payload 事件参数
     */
    handleTableOperation({ name, eventName, payload }) {
      console.log('handleTableOperation', name, eventName, payload)
    },
    /**
     * 测试列表
     */
    test() {
      axios
        .get(
          'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/listScheme'
        )
        .then((res) => {
          if (res.status === 200) {
            this.$refs.preForm.setFormJson(res.data)
            getFormInfo()
          }
        })

      const getFormInfo = () => {
        Promise.all([
          axios.get(
            'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/formScheme'
          ),
          axios.get(
            'https://www.fastmock.site/mock/f5c1c95be58bcf0e87d90568f7c1e114/form/tableData'
          )
        ]).then(([res1, res2]) => {
          const table = this.$refs.preForm.getWidgetRef('table')
          if (res1.status === 200) {
            table.setColumnsByScheme(res1.data)
          }
          if (res2.status === 200) {
            table.setValue(res2.data)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div.toolbar-container {
  //min-width: 728px;  /* 解决工具按钮栏换行的问题！！ */
  /* 上一行css有问题，当窗口宽度不足时会把按钮挤出到右边的属性设置区，弃之！ */
}

.left-toolbar {
  display: flex;
  margin-top: 4px;
  float: left;
  font-size: 16px;
}

.right-toolbar {
  display: flex;
  margin-top: 5px;
  float: right;
  text-align: right;
  overflow: hidden;

  .right-toolbar-con {
    text-align: left;
    width: 600px;
  }

  :deep(.el-button) {
    margin-left: 10px;
  }

  :deep(.el-button--text) {
    font-size: 14px !important;
  }

  :deep(.svg-icon) {
    margin-left: 0;
    margin-right: 0.05em;
  }
}

.el-button i {
  margin-right: 3px;
}

.small-padding-dialog {
  :deep(.el-dialog__header) {
    //padding-top: 3px;
    //padding-bottom: 3px;
    background: #f1f2f3;
  }

  :deep(.el-dialog__body) {
    padding: 12px 15px 12px 15px;

    .el-alert.alert-padding {
      padding: 0 10px;
    }
  }

  :deep(.ace-container) {
    border: 1px solid #dcdfe6;
  }
}

.dialog-title-light-bg {
  :deep(.el-dialog__header) {
    background: #f1f2f3;
  }
}

.no-box-shadow {
  box-shadow: none;
}

.no-padding.el-tabs--border-card {
  :deep(.el-tabs__content) {
    padding: 0;
  }
}

.form-render-wrapper {
  //height: calc(100vh - 142px);
  //all: revert !important; /* 防止表单继承el-dialog等外部样式，未生效，原因不明？？ */
}

.form-render-wrapper.h5-layout {
  margin: 0 auto;
  width: 420px;
  border-radius: 15px;
  //border-width: 10px;
  box-shadow: 0 0 1px 10px #495060;
  height: calc(100vh - 175px);
}

.form-render-wrapper.pad-layout {
  margin: 0 auto;
  width: 960px;
  border-radius: 15px;
  //border-width: 10px;
  box-shadow: 0 0 1px 10px #495060;
  height: calc(100vh - 175px);
}

.node-tree-drawer {
  :deep(.el-drawer) {
    padding: 10px;
    overflow: auto;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 12px;
    padding: 5px 5px 0;
  }

  :deep(.el-drawer__body) {
    padding-left: 5px;
  }
}

/*.node-tree-scroll-bar {*/
/*  height: 100%;*/
/*  overflow: auto;*/
/*}*/

:deep(.node-tree) {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 12px;
  }

  .el-tree-node__content {
    padding-left: 0 !important;
  }

  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .el-tree-node__children {
    padding-left: 12px;
    overflow: visible !important; /* 加入此行让el-tree宽度自动撑开，超出宽度el-draw自动出现水平滚动条！ */
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -10px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 16px;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background: #c2d6ea !important;
  }

  .el-tree-node__expand-icon {
    margin-left: -3px;
    padding: 6px 6px 6px 0px;
    font-size: 16px;
  }
}
</style>
