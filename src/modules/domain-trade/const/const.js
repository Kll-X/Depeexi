// 存放常量

// ! 订单状态
export const ORDER_STATUS = [
  {
    label: '全部',
    name: 'all',
    orderStatus: '',
    iconClass: 'tijiaodingdan-on', // 普通icon
    completeIcon: 'tijiaodingdan', // 完成的icon
    infoIcon: 'daizhifuInfo', //订单详情icon
    contLable: '', //订单详情提示语
  },
  {
    label: '待支付',
    name: 'pay',
    orderStatus: '1',
    iconClass: 'zhifu-on', // 普通icon
    completeIcon: 'zhifu', // 完成的icon
    contLable: '',
    infoIcon: 'daizhifuInfo',
  },
  {
    label: '待客审',
    name: 'guestJudge',
    orderStatus: '2',
    iconClass: 'shenhe-on',
    completeIcon: 'shenhe',
    infoIcon: 'daikesheninfo',
    contLable: '该笔订单已支付， 请尽快审核',
  },
  {
    label: '待配货',
    name: 'distribution',
    orderStatus: '3',
    iconClass: 'peihuo-on',
    completeIcon: 'peihuo',
    infoIcon: 'daipeihuoinfo',
    contLable: '该笔订单已审核通过',
  },
  {
    label: '待财审',
    name: 'financialAudit',
    orderStatus: '4',
    iconClass: 'caishen-on',
    completeIcon: 'caishen',
    infoIcon: 'daicaisheninfo',
    contLable: '该笔订单已配货， 请尽快审核',
  },
  {
    label: '待发货',
    name: 'delivery',
    orderStatus: '5',
    iconClass: 'fahuo-on',
    completeIcon: 'fahuo',
    infoIcon: 'daifahuoinfo',
    contLable: '该笔订单已配货， 请尽快发货',
  },
  {
    label: '待收货',
    name: 'receive',
    orderStatus: '6',
    iconClass: 'shouhuo-on',
    completeIcon: 'shouhuo',
    infoIcon: 'daishouhuoinfo',
    contLable: '该笔订单已发货， 等待客户签收',
  },
  {
    label: '已完成',
    name: 'finish',
    number: 0,
    orderStatus: '7',
    iconClass: 'wancheng-on',
    completeIcon: 'wancheng',
    infoIcon: 'yiwanchenginfo',
    contLable: '该笔订单已完成',
  },
  {
    label: '已取消',
    name: 'cancel',
    orderStatus: '8',
    iconClass: 'guanbi-on',
    completeIcon: 'guanbi',
    infoIcon: 'yiquxiaoinfo',
    contLable: '该笔订单已取消',
  },
]

// ! 退货状态
export const ORDER_SALE_STATUS = [
  {
    label: '全部',
    name: 'all',
    orderStatus: '',
    iconClass: 'tijiaodingdan-on', // 普通icon
    completeIcon: 'tijiaodingdan', // 完成的icon
    infoIcon: '',
  },
  {
    label: '待审核',
    name: 'review',
    orderStatus: '1',
    iconClass: 'guanbi-on', // 普通icon
    completeIcon: 'guanbi', // 完成的icon
    infoIcon: 'daishenheinfo',
    contLable: '',
  },
  {
    label: '待退货',
    name: 'returnGoods',
    iconClass: 'tuihuo-on',
    completeIcon: 'tuihuo',
    infoIcon: 'daituikuaninfo',
    orderStatus: '3',
    contLable: '',
  },
  {
    label: '待验货',
    name: 'inspectionGoods',
    iconClass: 'yanhuo-on',
    completeIcon: 'yanhuo',
    infoIcon: 'daiyanhuoinfo',
    orderStatus: '4',
    contLable: '',
  },
  {
    label: '待退款',
    name: 'refund',
    iconClass: 'tuikuan-on',
    completeIcon: 'tuikuan',
    infoIcon: 'daituikuaninfo',
    orderStatus: '5',
    contLable: '',
  },
  {
    label: '已完成',
    name: 'finished',
    iconClass: 'wancheng-on',
    completeIcon: 'wancheng',
    infoIcon: 'yiwanchenginfo',
    orderStatus: '7',
    contLable: '该笔退货单已完成',
  },
  {
    label: '退款中',
    name: 'returnMoney',
    iconClass: '',
    completeIcon: '',
    infoIcon: '',
    orderStatus: '6',
    contLable: '该笔退货单退款中',
  },
  {
    label: '已取消',
    name: 'cancel',
    iconClass: 'guanbi-on',
    completeIcon: 'guanbi',
    infoIcon: 'yiquxiaoinfo',
    orderStatus: '2',
    contLable: '该笔退款订单已取消',
  },
  {
    label: '已删除',
    name: 'del',
    orderStatus: '8',
    infoIcon: 'daipeihuoinfo',
  },
]

// ! 退货类型
export const RETURN_GOODS_TYPE = [
  {
    value: '2',
    label: '退货退款',
  },
  {
    value: '1',
    label: '仅退款',
  },
]

// !  支付方式

export const PAY_TYPE = [
  {
    label: '其他',
    value: '99',
  },
  {
    label: '微信',
    value: '2',
  },
  {
    label: '支付宝',
    value: '3',
  },
  {
    label: '云闪付',
    value: '4',
  },
]
