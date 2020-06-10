export default [
  {
    name: 'decorate',
    path: '/system/decorate',
    meta: {
      title: '商城装修',
    },
    component: './views/index.vue',
    children: [
      {
        path: '',
        redirect: 'banner',
        component: './views/index.vue',
      },
      {
        name: 'banner',
        path: 'banner',
        meta: {
          title: 'Banner配置',
        },
        component: './views/banner.vue',
      },
      {
        name: 'subject',
        path: 'subject',
        meta: {
          title: '专题页配置',
        },
        component: './views/subject.vue',
      },
      {
        name: 'billboards',
        path: 'billboards',
        meta: {
          title: '商品榜单配置',
        },
        component: './views/billboards.vue',
      },
      {
        name: 'recommendation',
        path: 'recommendation',
        meta: {
          title: '精选规则',
        },
        component: './views/recommendation.vue',
      },
    ],
  },
]
