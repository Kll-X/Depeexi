/**
 * 这个文件主要存储字典数据,命名方式为全大写下划线分割单词.
 * @author liguobiao
 * @date 2019/10/16
 */

// 状态
export const STATUS_OPTIONS__PROPERTY = [
  {
    label: '启用',
    className: 'green',
    value: 1,
  },
  {
    label: '禁用',
    className: 'gray',
    value: 0,
  },
]

// export const PROPERTY_STATUS = [
//   {
//     label: '禁用',
//     value: 0,
//   },
//   {
//     label: '启用',
//     value: 1,
//   },
// ]

export const STATUS_OPTIONS__SHELVES = [
  {
    label: '未上架',
    className: 'gray',
    value: '0',
  },
  {
    label: '已上架',
    className: 'green',
    value: '1',
  },
  {
    label: '待上架',
    className: 'gray',
    value: '2',
  },

]

export const STATUS_OPTIONS__SHELVES_SEARCH = [
  {
    label: '已上架',
    className: 'green',
    value: '1',
  },
  {
    label: '待上架',
    className: 'gray',
    value: '2',
  },

]
export const STATUS_OPTIONS__SHELVES_EDIT = [
  {
    label: '上架',
    value: 1,
  },
  {
    label: '下架',
    value: 0,
  },
]

//商品属性类型
export const ATTRIBUTE_TYPES = [
  {
    label: '关键属性',
    value: '1',
  },
  {
    label: '销售属性',
    value: '2',
  },
  {
    label: '非关键属性',
    value: '3',
  },
]

// 输入方式
export const INPUT_TYPE = [
  {
    label: '枚举',
    value: 1,
  },
  {
    label: '填写',
    value: 0,
  },
]

export const TERMINAL_TYPES = {
  图片: 0,
  视频: 1,
  PC端: 2,
  移动端: 3,
}

export const CHECK_STATUS = [
  {
    value: 0,
    label: '未审核',
    className: 'gray',
  },
  {
    value: 1,
    label: '审核通过',
    className: 'green',
  },
  {
    value: 2,
    label: '审核不通过',
    className: 'red',
  },
]
