export default [
  {
    name: 'product',
    path: '/product',
    component: './views/index.vue',
    meta: {
      title: '商品',
    },
  },
  // 商品配置主页面
  {
    name: 'product-config',
    path: '/system/product',
    component: './views/system/product/index.vue',
    redirect: '/system/product/brand', // 设置默认打开的页面
    meta: {
      title: '商品配置',
    },
    children: [
      // 品牌
      {
        name: 'barnd-list',
        path: '/system/product/brand',
        component: './views/system/product/brand/index.vue',
        meta: {
          title: '品牌列表',
        },
      },
      {
        name: 'brand-new',
        path: '/system/product/brand/new',
        component: './views/system/product/brand_new/index.vue',
        meta: {
          title: '新增品牌',
        },
      },
      {
        name: 'brand-edit',
        path: '/system/product/brand/edit/:id',
        component: './views/system/product/brand_new/index.vue',
        meta: {
          title: '编辑品牌',
        },
      },
      // 品牌详情
      {
        name: 'brand-detail',
        path: '/system/product/brand/detail/:id',
        component: './views/system/product/brand_detail/index.vue',
        meta: {
          title: '查看品牌详情',
        },
      },

      // 属性
      {
        name: 'property-list',
        path: '/system/product/property',
        component: './views/system/product/property/index.vue',
        meta: {
          title: '属性列表',
        },
      },
      {
        name: 'property-new',
        path: '/system/product/property/new',
        component: './views/system/product/property_new/index.vue',
        meta: {
          title: '新增属性',
        },
      },
      {
        name: 'property-edit',
        path: '/system/product/property/edit/:id',
        component: './views/system/product/property_new/index.vue',
        meta: {
          title: '编辑属性',
        },
      },
      // 属性详情
      {
        name: 'property-detail',
        path: '/system/product/property/detail/:id',
        component: './views/system/product/property_detail/index.vue',
        meta: {
          title: '查看属性详情',
        },
      },


      {
        name: 'category-back',
        path: '/system/product/category/back',
        component: './views/system/product/category_back/index.vue',
        meta: {
          title: '后台类目',
        },
      },
      {
        name: 'category-front',
        path: '/system/product/category/front',
        component: './views/system/product/category_front/index.vue',
        meta: {
          title: '前台类目',
        },
      },
    ],
  },

  {
    name: 'sales-status-page',
    path: '/product/sales-status',
    component: './views/product/sales-status/index.vue',
    meta: {
      title: '上架到商城',
    },
    children: [
      // 上下架
      {
        name: 'sales-status-list',
        path: '/product/sales-status',
        component: './views/product/sales-status/list.vue',
        meta: {
          title: '商品上架列表',
        },
      },
      {
        name: 'sales-status-detail',
        path: '/product/sales-status/detail/:id',
        component: './views/product/sales-status_detail',
        meta: {
          title: '查看商品上下架详情',
        },
      },
      {
        name: 'sales-status-edit',
        path: '/product/sales-status/edit/:id',
        component: './views/product/sales-status_edit',
        meta: {
          title: '编辑商品上下架详情',
        },
      },
      {
        name: 'sales-status-new',
        path: '/product/sales-status/new',
        component: './views/product/sales-status_new',
        meta: {
          title: '新增上下架商品',
        },
      },
    ]
  },



  // 商品资料
  {
    name: 'single-info-page',
    path: '/product/single-info',
    component: './views/product/single-info/index.vue',
    meta: {
      title: '商品资料',
    },
    children: [
      // 商品资料
      {
        name: 'single-info-list',
        path: '/product/single-info',
        component: './views/product/single-info/list',
        meta: {
          title: '商品资料列表',
        },
      },
      {
        name: 'single-info-new',
        path: '/product/single-info/new',
        component: './views/product/single-info_new/edit',
        meta: {
          title: '新增商品',
        },
      },
      {
        name: 'single-info-edit',
        path: '/product/single-info/edit/:id',
        component: './views/product/single-info_new/edit',
        meta: {
          title: '编辑商品',
        },
      },
      {
        name: 'single-info-detail',
        path: '/product/single-info/detail/:id',
        component: './views/product/single-info_detail',
        meta: {
          title: '查看商品',
        },
      },
    ]
  },


]
