export default [
  {
    name: 'order',
    path: '/order',
    component: './views/order',
    meta: {
      title: '订单',
    },
    children: [
      {
        name: 'orderList',
        path: '/order',
        component: './views/order/list',
        meta: {
          title: '订单列表',
        },
      },
      {
        name: 'orderDetail',
        path: 'detail',
        component: './views/order-details',
        meta: {
          title: '订单详情',
        },
      },
      {
        name: 'manual',
        path: 'manual',
        component: './views/order/manual/_',
        meta: {
          title: '手工开单',
        },
      },
      {
        name: 'orderSetting',
        path: 'orderSetting',
        component: './views/order/order-setting',
        meta: {
          title: '订单配置',
        },
      },
    ],
  },
  {
    name: 'afterSale',
    path: '/after-sale/returned',
    component: './views/after-sale',
    meta: {
      title: '退货单',
    },
    children: [
      {
        name: 'afterSaleList',
        path: '/after-sale/returned',
        component: './views/after-sale/list',
        meta: {
          title: '退货单',
        },
      },
      {
        name: 'afterSaleDetail',
        path: 'detail',
        component: './views/order-details',
        meta: {
          title: '订单详情',
        },
      },
      {
        name: 'afterSaleSetting',
        path: 'afterSaleSetting',
        component: './views/after-sale/after-sale-setting',
        meta: {
          title: '售后配置',
        },
      },
    ],
  },
]
