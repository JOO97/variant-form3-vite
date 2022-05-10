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
  icon: 'tag',
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
  icon: 'tag',
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
