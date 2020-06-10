const getFormConfig = function() {
  return [
    {
      $id: 'username',
      $type: 'input',
      label: '用户名',
      $el: {placeholder: '请输入用户名'},
      rules: [
        {
          required: true,
          message: '请输入用户名，不超过30个字符',
          max: 30,
          trigger: ['blur', 'change'],
          transform: v => v && v.trim(),
        },
      ],
    },
    {
      $id: 'password',
      $type: 'input',
      label: '密码',
      $el: {placeholder: '请输入密码', type: 'password'},
      rules: [
        {
          required: true,
          message: '请输入密码',
          trigger: ['blur', 'change'],
          transform: v => v && v.trim(),
        },
      ],
    },
    {
      $id: 'checkpassword',
      $type: 'input',
      label: '确认密码',
      $el: {placeholder: '请再次输入密码', type: 'password'},
      rules: [
        {
          required: true,
          message: '请再次输入密码',
          trigger: ['blur', 'change'],
          transform: v => v && v.trim(),
        },
        {
          validator: (rule, value, callback) => {
            const formValue = this.$refs.form.getFormValue()

            if (value != formValue.password) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      $id: 'usernumber',
      $type: 'input',
      label: '员工编号',
      $el: {placeholder: '请输入员工编号'},
      rules: [
        {
          required: true,
          message: '请输入员工编号',
          trigger: ['blur', 'change'],
          transform: v => v && v.trim(),
        },
        {
          validator: (rule, value, callback) => {
            if (!/^[\w-_]+$/.test(value)) {
              callback(new Error('仅支持输入数字英文-_'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      $id: 'phone',
      $type: 'input',
      label: '手机号',
      $el: {placeholder: '请输入手机号', type: 'number'},
      rules: [
        {
          required: true,
          message: '请输入手机号',
          trigger: ['blur', 'change'],
          transform: v => v && v.trim(),
        },
        {
          validator: (rule, value, callback) => {
            if (!/^1[3456789]\d{9}$/.test(value)) {
              callback(new Error('请输入正确的手机号'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      $id: 'name',
      $type: 'input',
      label: '昵称',
      $el: {placeholder: '请输入昵称'},
    },
    {
      $id: 'nameEn',
      $type: 'input',
      label: '英文昵称',
      $el: {placeholder: '请输入英文昵称'},
      rules: [
        {
          validator: (rule, value, callback) => {
            if (value && !/^[a-zA-Z]+$/.test(value)) {
              callback(new Error('请输入英文'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    },
    {
      $id: 'gender',
      $attrs: {},
      $el: {},
      $type: 'radio-group',
      label: '性别',
      $default: 0,
      $options: [{label: '男', value: 0}, {label: '女', value: 1}],
    },
    {
      $id: 'email',
      $type: 'input',
      label: '邮箱',
      $el: {placeholder: '请输入邮箱'},
      rules: [
        {
          validator: (rule, value, callback) => {
            const checkEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (value && !checkEmail.test(value)) {
              callback(new Error('请输入正确的邮箱'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    },
  ]
}
export default getFormConfig
