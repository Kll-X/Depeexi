export default [
  {
    name: 'member',
    path: '/member/account-info',
    component: './views/member/children.vue',
    meta: {
      title: '会员',
    },
    children: [
      {
        name: 'member-info',
        path: '/member/account-info',
        component: './views/member/account-info/index.vue',
        meta: {
          title: '会员信息',
        },
      },
      {
        name: 'member-account-info',
        path: '/member/account-info',
        component: './views/member/children.vue',
        meta: {
          title: '会员信息',
        },
        children: [
          {
            name: 'member-account-info-new',
            path: '/member/account-info/new',
            component: './views/member/account-info_new/index.vue',
            meta: {
              title: '新增会员信息',
            },
          },
          {
            name: 'member-account-info-edit',
            path: '/member/account-info/edit',
            component: './views/member/account-info_new/index.vue',
            meta: {
              title: '编辑会员信息',
            },
          },
          {
            name: 'member-account-info-view',
            path: '/member/account-info/view',
            component: './views/member/account-info_view/index.vue',
            meta: {
              title: '查看会员详情',
            },
          },
        ],
      },
    ],
  },
]
