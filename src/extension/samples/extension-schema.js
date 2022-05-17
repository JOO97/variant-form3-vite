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
    //table属性 1
    height: '',
    'max-height': '',
    stripe: false,
    border: false,
    size: 'default',
    fit: true,
    'show-header': true,
    'highlight-current-row': true,
    'empty-text': 'No Data',
    layout: 'auto', //布局
    'scrollbar-always-on': false,
    //table 属性 2---------------
    'show-summary': false,
    test: 'auto',
    //---------------------
    // type: 'success',
    name: '',
    label: '',
    // displayStyle: 'block',
    // columnWidth: '200px',

    //数据------------------
    columns: `[
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
    'data-source': {
      type: 'api',
      name: 'table数据api',
      request: {
        url: 'https://www.fastmock.site/mock/e9710039bb5f11262d1a0f2f0bbe08c8/vform3/getFS',
        method: 'GET',
        headers: {},
        params: {},
        data: {}
      },
      beforeRequest: `function () {}`,
      afterRequest: `function () {}`
    },
    //-------------------
    customClass: '', //自定义css类名
    //事件-------------------
    onCreated: '',
    onMounted: '',
    onClick: '',
    onClose: ''
  }
}
