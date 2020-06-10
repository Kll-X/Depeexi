const getColumnConfig = h => {
  return [
    {
      type: 'selection',
    },
    {
      prop: 'name',
      label: '角色名称',
    },

    {
      prop: 'enName',
      label: '英文名',
    },
    // {
    //   prop: 'status',
    //   label: '状态',
    //   formatter: ({status}) => {
    //     return {
    //       0: <span class="enable">启用</span>,
    //       1: <span class="disable">禁用</span>,
    //     }[status]
    //   },
    // },
    {
      prop: 'description',
      label: '备注',
    },
  ]
}

export default getColumnConfig
