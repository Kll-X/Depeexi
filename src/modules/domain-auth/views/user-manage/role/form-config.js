const getFormConfig = [
  {
    $id: 'name',
    $type: 'input',
    label: '角色名称',
    $el: {placeholder: '请输入角色名称'},
    rules: [
      {
        required: true,
        message: '请输入角色名称',
        trigger: 'blur',
        transform: v => v && v.trim(),
      },
    ],
  },
  {
    $id: 'enName',
    $type: 'input',
    label: '角色英文名',
    $el: {placeholder: '请输入角色英文名'},
    rules: [
      {
        message: '请输入角色英文名',
        trigger: 'blur',
        transform: v => v && v.trim(),
      },
      {
        validator: (rule, value, callback) => {
          if (value && !/^[a-zA-Z]+$/.test(value)) {
            callback(new Error('请输入英文'))
          } else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],
  },
  {
    $id: 'description',
    $type: 'input',
    label: '备注',
    $el: {placeholder: '请输入备注', type: 'textarea', rows: 3},
    rules: [],
  },
]

export default getFormConfig
