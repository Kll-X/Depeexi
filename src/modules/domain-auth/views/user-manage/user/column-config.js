const getColumnConfig = h => {
  return [
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'usernumber',
      label: '员工编号',
    },
    {
      prop: 'name',
      label: '昵称',
    },
    {
      prop: 'nameEn',
      label: '英文昵称',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'gender',
      label: '性别',
      formatter: ({gender}) => {
        return {
          0: '男',
          1: '女',
        }[gender]
      },
    },
    {
      prop: 'status',
      label: '状态',
      formatter: ({status}) => {
        return {
          1: <state-tag type="success">启用</state-tag>,
          0: <state-tag type="danger">禁用</state-tag>,
        }[status]
      },
    },
    {
      prop: 'phone',
      label: '手机号码',
    },
  ]
}

export default getColumnConfig
