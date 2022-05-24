export const cardSchema = {
  type: 'card',
  category: 'container',
  icon: 'card',
  widgetList: [],
  options: {
    name: '',
    label: 'card',
    hidden: false,
    folded: false,
    showFold: true,
    cardWidth: '100%',
    shadow: 'never',
    customClass: ''
  }
}

export const alertSchema = {
  type: 'alert',
  icon: 'alert',
  formItemFlag: false,
  options: {
    name: '',
    title: 'Good things are coming...',
    type: 'info',
    description: '',
    closable: true,
    closeText: '',
    center: true,
    showIcon: false,
    effect: 'light',
    hidden: false,
    onClose: '',
    customClass: ''
  }
}

export const tagSchema = {
  type: 'tag',
  icon: 'button',
  formItemFlag: false,
  options: {
    type: 'success',
    name: '',
    label: '',
    displayStyle: 'block',
    columnWidth: '200px',
    color: '#409eff',

    //-------------------
    customClass: '', //自定义css类名
    //事件-------------------
    onCreated: '',
    onMounted: '',
    onClick: '',
    onClose: ''
  }
}

export const resultSchema = {
  type: 'result',
  icon: 'section',
  formItemFlag: false,
  options: {
    type: 'success',
    name: '',
    label: '',
    displayStyle: 'block',
    columnWidth: '200px',

    //-------------------
    customClass: '', //自定义css类名
    //事件-------------------
    onCreated: '',
    onMounted: '',
    onClick: '',
    onClose: ''
  }
}

export const tableSchema = {
  type: 'table',
  icon: 'table',
  formItemFlag: false,
  options: {
    name: '',
    label: '',
    // displayStyle: 'block',
    // columnWidth: '200px',
    customClass: '', //自定义css类名
    //-------------------------
    height: '',
    'max-height': '',
    stripe: true,
    border: true,
    size: 'default',
    fit: true,
    'show-header': true,
    'highlight-current-row': true,
    'empty-text': 'No Data',
    layout: 'auto', //布局
    'scrollbar-always-on': false,
    'show-operation': true, //是否显示操作栏
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
          plain: true,
          emit: true
        },
        {
          label: '编辑',
          name: 'edit',
          type: 'success',
          size: 'small',
          circle: false,
          visible: true,
          disable: '',
          plain: true,
          emit: true
        },
        {
          label: '删除',
          name: 'delete',
          type: 'danger',
          size: 'small',
          circle: false,
          visible: true,
          disable: '',
          plain: true,
          emit: false
        }
      ]
    },
    usePagination: false, //分页

    //数据------------------
    columns: `[
       {
        "prop": "id",
        "label": "ID",
        "width":"",
        "sortable":true,
        "fixed":false,
        "align":"left"
      },
      {
        "prop": "date",
        "label": "日期",
        "width":"",
        "sortable":false,
        "fixed":false,
        "align":"left"
      }, {
        "prop": "name",
        "label": "名字",
        "width":"",
        "sortable":false,
        "fixed":false,
        "align":"left"
      }, {
        "prop": "address",
        "label": "地址",
         "width":"",
        "sortable":false,
        "fixed":false,
        "align":"left"
      }
    ]`,
    data: `[{
      "date":"2022-12-22",
      "name": "joo",
      "address": "xm"
    },
    {
      "date":"2022-12-22",
      "name": "joo1",
      "address": "xm"
    }
  ]`,
    'use-data-source': true, //使用数据源
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
    //事件-------------------
    onCreated: '',
    onMounted: '',
    onPageSizeChange: '',
    onCurrentPageChange: '',
    onOperationButtonClick: ''
  }
}
