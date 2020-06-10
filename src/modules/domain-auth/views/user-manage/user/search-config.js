export default [
  {
    el: {placeholder: '请输入用户名', clearable: true},
    label: '用户名',
    id: 'username',
    type: 'input',
  },
  {
    el: {placeholder: '请选择', clearable: true},
    label: '状态',
    id: 'status',
    type: 'select',
    options: [
      {
        label: '启用',
        value: '1',
      },
      {
        label: '禁用',
        value: '0',
      },
    ],
  },
]
