<template>
  <div class="sales-status">
    <el-data-table ref="dataTable" v-bind="tableConfig" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {STATUS_OPTIONS__SHELVES,STATUS_OPTIONS__SHELVES_SEARCH} from '^domain-goods/const/dictionary.js'
import {ArrayToObject} from '^domain-goods/const/array-to-object.js'
import {
  commodityShelvesPage_String,
  putCommodityShelves,
  delCommodityShelves,
} from '^domain-goods/services/commodity-center.js'

// const status = {
//   2: '待上架',
//   1: '上架',
//   0: '下架',
// }
export default {
  data() {
    return {
      tableConfig: {
        url: commodityShelvesPage_String,
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        // extraQuery: {
        //   status: '1', // 列表只展示上架
        // },
        extraButtons: [
          // {
          //   type: 'primary',
          //   text: '查看',
          //   atClick: row => {
          //     this.routerLinkToDetail(row.id)
          //     return Promise.resolve(false)
          //   },
          // },
          {
            type: 'primary',
            show: row => {
              return row.status === 0 // 只有未上架可以编辑 0:未上架 1:上架 2:待上架
            },
            text: '编辑',
            atClick: row => {
              this.routerLinkToEdit(row.id)
              return Promise.resolve(false)
            },
          },
          {
            type: 'primary',
            show: row => {
              const {status} = row
              return status === 1 || status === 0
            },
            text: row => {
              return row.status === 1 ? '下架' : '上架' // 0:未上架 1:上架 2:待上架
            },
            atClick: row => {
              this.shelvesAction(row)
              return Promise.resolve(false)
            },
          },
        ],
        operationAttrs: {
          width: '120px',
          fixed: 'right',
        },
        headerButtons: [
          {
            type: 'primary',
            text: '批量上架商品',
            atClick: row => {
              this.routerLinkToNew()
              return Promise.resolve(false)
            },
          },
        ],
        columns: [
          {
            // prop: 'cannelName',
            //未接入
            minWidth: 120,
            prop: 'channelId',
            label: '渠道名称',
            formatter: (_, __, value) => {
              return <span>{value || '渠道名称'}</span>
            },
            'show-overflow-tooltip': true,
          },
          {
            // prop: 'shopName',
            //未接入
            minWidth: 120,
            prop: 'shopId',
            label: '店铺名称',
            formatter: (_, __, value) => {
              return <span>{value || '店铺名称'}</span>
            },
            'show-overflow-tooltip': true,
          },
          // {
          //   //未接入
          //   minWidth:120,
          //   prop: 'cannelGoodCode',
          //   label: '渠道商品编码',
          //   formatter: (_, __, value) => {
          //     return <span>{value || '渠道商品编码'}</span>
          //   },
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   //未接入
          //   minWidth:120,
          //   prop: 'cannelGoodName',
          //   label: '渠道商品名称',
          //   formatter: (_, __, value) => {
          //     return <span>{value || '渠道商品名称'}</span>
          //   },
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   //未接入
          //   minWidth:120,
          //   prop: 'cannelGoodSKU',
          //   label: '渠道商品SKU编码',
          //   formatter: (_, __, value) => {
          //     return <span>{value || '渠道商品SKU编码'}</span>
          //   },
          //   'show-overflow-tooltip': true,
          // },
          {
            minWidth: 120,
            prop: 'status', // 0:未上架 1:上架 2:待上架
            label: '上架状态',
            formatter: (_, __, value) => {
              const {label, className} =
                ArrayToObject(STATUS_OPTIONS__SHELVES)[value] || {}
              return <span class={`status-text ${className}`}>{label}</span>
            },
          },
          {
            minWidth: 120,
            prop: 'itemWholeDTO.code',
            label: '系统商品编码',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'itemWholeDTO.name',
            label: '系统商品名称',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            // prop: 'systemGoodSKU',
            prop: 'skuDTO.code',
            // prop: 'skuId',
            label: '系统商品SKU编码',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 150,
            prop: 'updatedTime',
            label: '更新时间',
            formatter: (_, __, value) =>
              dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
        searchForm: [
          // {
          //   $type: 'select',
          //   $id: 'channelId',
          //   label: '渠道',
          //   $el: {
          //     placeholder: '请选择',
          //     clearable: true,
          //     // 'prefix-icon': 'el-icon-search',
          //   },
          //   options: [],
          // },
          // {
          //   $type: 'select',
          //   $id: 'shopId',
          //   label: '店铺',
          //   $el: {
          //     clearable: true,
          //     placeholder: '请选择',
          //   },
          //   options: [],
          // },
          // {
          //   $type: 'input',
          //   $id: 'code',
          //   label: '商品编码',
          //   $el: {
          //     clearable: true,
          //     placeholder: '请输入',
          //   },
          // },
          // {
          //   $type: 'input',
          //   $id: 'name',
          //   label: '商品名称',
          //   $el: {
          //     clearable: true,
          //     placeholder: '请输入',
          //   },
          // },
          {
            $type: 'select',
            $id: 'status',
            label: '上架状态',
            $el: {
              clearable: true,
              placeholder: '请选择',
            },
            options: STATUS_OPTIONS__SHELVES_SEARCH,
          },
        ],
      },
    }
  },
  methods: {
    shelvesAction({
      id,
      skuId,
      status,
      itemId,
      shopId,
      cannelName = '渠道名称',
      shopName = '店铺名称',
      itemWholeDTO = {},
    }) {
      const msg =
        status === 1
          ? `您确认从${cannelName}${shopName}下架${itemWholeDTO.name}吗？`
          : `您确认上架${itemWholeDTO.name}到${cannelName}${shopName}吗？`
      this.$confirm(
        msg, // 0:未上架 1:上架 2:待上架
        '提示',
        {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              const msg = status === 1 ? '下架' : '上架'
              // const params = {id, itemId, status: status === 1 ? 0 : 1, shopId, skuId}
              // putCommodityShelves(params)
              delCommodityShelves({ids: [id]})
                .then(res => {
                  this.$refs.dataTable.getList()
                  this.$message.success(`${msg}成功`)
                  done()
                })
                .finally(res => {
                  instance.confirmButtonLoading = false
                })
              return
            }
            done()
          },
        },
      ).catch(() => {})
    },
    routerLinkToNew(id) {
      this.$router.push({
        path: `/product/sales-status/new`,
      })
    },
    routerLinkToDetail(id) {
      this.$router.push({
        path: `/product/sales-status/detail/${id}`,
      })
    },
    routerLinkToEdit(id) {
      this.$router.push({
        path: `/product/sales-status/edit/${id}`,
      })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/status.less';

.sales-status {
  padding: 20px;
}
</style>
