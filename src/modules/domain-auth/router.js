export default [
  {
    name: 'account',
    path: '/system/account',
    meta: {
      title: '用户管理',
    },
    component: './views/user-manage/index.vue',
    children: [
      {
        path: '',
        redirect: 'user-management',
        component: './views/user-manage/user/index.vue',
      },
      {
        name: 'user-manage',
        path: 'user-management',
        meta: {
          title: '用户列表',
        },
        component: './views/user-manage/user/index.vue',
      },
      {
        name: 'user-detail',
        path: 'user-detail',
        meta: {
          title: '用户详情',
        },
        component: './views/user-manage/user/detail.vue',
      },
      {
        name: 'role-detail',
        path: 'role-detail',
        meta: {
          title: '角色详情',
        },
        component: './views/user-manage/role/detail.vue',
      },
      {
        name: 'role-manage',
        path: 'role-management',
        meta: {
          title: '角色列表',
        },
        component: './views/user-manage/role/index.vue',
      },
    ],
  },
]
