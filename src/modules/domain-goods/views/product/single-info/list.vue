<template>
  <div class="brand-management">
    <el-data-table ref="dataTable" v-bind="tableconfig" :url="setCommodityUrl"></el-data-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {ArrayToObject} from '^domain-goods/const/array-to-object.js'
import {
  goodsList_String,
  delCommodityGoodsBatch,
  putCommodityGoods,
  getBrandList,
  getBackCategorys,
} from '^domain-goods/services/commodity-center.js'
import {
  CHECK_STATUS,
  STATUS_OPTIONS__SHELVES,
} from '^domain-goods/const/dictionary.js'

export default {
  data() {
    return {
      status: 0,
      checkoutUrl: /commodity-list-onshelves/.test(this.$route.path),
      tableconfig: {
        firstPage: 1,
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        hasOperation: true,
        hasPagination: true,
        extraButtons: [
          {
            text: '查看',
            atClick: row => {
              const {id} = row['itemWhole']
              this.jumpShowPage(id)
              // 跳转详情页
              return Promise.resolve()
            },
          },
          {
            text: '编辑',
            show: ({itemWhole}) => {
              return itemWhole.saleStatus === 0
            },
            atClick: row => {
              const {id} = row['itemWhole']
              this.jumpEditPage(id)
              // 跳转
              return Promise.resolve()
            },
          },
          {
            text: '审核',
            show: row => {
              const {status} = row['itemWhole']
              return (
                status ===
                (CHECK_STATUS.find(v => v.label === '未审核') &&
                  CHECK_STATUS.find(v => v.label === '未审核').value)
              )
            },
            atClick: row => {
              this.$confirm(`商品审核通过后，才能进行上下架操作`, '审核', {
                confirmButtonLoading: false,
                confirmButtonText: '通过',
                cancelButtonText: '驳回',
                distinguishCancelAndClose: true,
                type: 'warning',
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    const {id} = row['itemWhole']
                    setTimeout(() => {
                      this.$confirm(
                        `商品审核通过后将可以对外上架，您确定通过吗？`,
                        '审核通过提示',
                        {
                          confirmButtonLoading: false,
                          type: 'warning',
                          beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                              instance.confirmButtonLoading = true
                              const statusObj = CHECK_STATUS.find(v => {
                                return v.label === '审核通过'
                              })
                              const {value} = statusObj
                              const params = {
                                id,
                                itemWholeUpdate: {
                                  id,
                                  status: value,
                                },
                              }
                              putCommodityGoods(params)
                                .then(({payload}) => {
                                  this.$message.success('修改成功')
                                  this.$refs.dataTable.getList()
                                })
                                .finally(() => {
                                  instance.confirmButtonLoading = false
                                  done()
                                })
                            }
                            done()
                          },
                        },
                      ).catch(() => {})
                    }, 0)
                  }
                  if (action === 'cancel') {
                    instance.cancelButtonLoading = true
                    const {id} = row['itemWhole']
                    instance.cancelButtonLoading = false
                    setTimeout(() => {
                      this.$confirm(
                        `商品审核驳回后需重新提交，您确认驳回吗？`,
                        '审核驳回提示',
                        {
                          cancelButtonLoading: false,
                          type: 'warning',
                          beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                              instance.confirmButtonLoading = true
                              const statusObj = CHECK_STATUS.find(v => {
                                return v.label === '审核不通过'
                              })
                              const {value} = statusObj
                              // 此处进行二次弹窗，包括驳回和通过
                              const params = {
                                id,
                                itemWholeUpdate: {
                                  id,
                                  status: value,
                                },
                              }
                              putCommodityGoods(params)
                                .then(({payload}) => {
                                  this.$message.success('修改成功')
                                  this.$refs.dataTable.getList()
                                })
                                .finally(() => {
                                  instance.confirmButtonLoading = false
                                  done()
                                })
                            }
                            done()
                          },
                        },
                      ).catch(() => {})
                    }, 0)
                  }
                  done()
                },
              }).catch(() => {})
              return Promise.resolve(false)
            },
          },
          {
            text: '删除',
            class: 'text-danger-button',
            show: row => {
              const {saleStatus} = row['itemWhole']
              return (
                saleStatus === 0
                // status ===
                // (CHECK_STATUS.find(v => v.label === '审核不通过') &&
                //   CHECK_STATUS.find(v => v.label === '审核不通过').value)
              )
            },
            atClick: row => {
              this.$confirm(
                `删除${row['itemWhole'] &&
                  row['itemWhole'].name}商品后，将无法恢复.您确认删除吗?`,
                '删除提示',
                {
                  confirmButtonLoading: false,
                  type: 'warning',
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true
                      const {id} = row['itemWhole']
                      const ids = [id]
                      const params = {ids} // 删除的skuid数组
                      delCommodityGoodsBatch(params)
                        .then(res => {
                          this.$message.success('删除成功')
                          this.$refs.dataTable.getList()
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
              return Promise.resolve(false)
            },
          },
        ],
        operationAttrs: {
          width: '160px',
          fixed: 'right',
        },
        headerButtons: [
          {
            type: 'primary',
            text: '新增商品',
            atClick: row => {
              this.$router.push('/product/single-info/new')
              return Promise.resolve(false)
            },
          },
        ],
        columns: [
          {
            type: 'selection',
          },
          {
            prop: 'itemWhole.name',
            label: '商品名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'itemWhole.code',
            label: '商品编码',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'itemWhole.chineseName',
            label: '商品品牌',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'itemWhole.categoryName',
            label: '商品后台类目',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'itemWhole.status',
            label: '审核状态',
            formatter: (_, __, value) => {
              let {label, className} = ArrayToObject(CHECK_STATUS)[value] || {}
              return <span class={`status-text ${className}`}>{label}</span>
            },
          },
          {
            minWidth: 120,
            prop: 'itemWhole.saleStatus',
            label: '上架状态',
            formatter: (_, __, value) => {
              const {label, className} =
                ArrayToObject(STATUS_OPTIONS__SHELVES)[value] || {}
              return <span class={`status-text ${className}`}>{label}</span>
            },
          },
          {
            minWidth: 150,
            prop: 'itemWhole.updatedTime',
            label: '更新时间',
            formatter: (v, k, val) => {
              return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
            },
          },
        ],
        searchForm: [
          {
            $type: 'select',
            $id: 'categoryId',
            label: '后台类目',
            $el: {
              clearable: true,
              placeholder: '后台类目',
            },
            options: [],
          },
          {
            $type: 'input',
            $id: 'code',
            label: '商品编码',
            $el: {
              clearable: true,
              placeholder: '商品编码',
            },
          },
          {
            $type: 'input',
            $id: 'name',
            label: '商品名称',
            $el: {
              clearable: true,
              placeholder: '商品名称',
            },
          },

          {
            $type: 'select',
            $id: 'brandId',
            label: '商品品牌',
            $el: {
              clearable: true,
              placeholder: '商品品牌',
            },
            options: [],
          },
          {
            $type: 'select',
            $id: 'status',
            label: '审核状态',
            $el: {
              clearable: true,
              placeholder: '请选择',
            },
            options: CHECK_STATUS,
          },
          // {
          //   $type: 'select',
          //   $id: 'saleStatus',
          //   label: '上架状态',
          //   $el: {
          //     clearable: true,
          //     placeholder: '请选择',
          //     clearable: true,
          //   },
          //   options: STATUS_OPTIONS__SHELVES,
          // },
        ],
      },
    }
  },
  computed: {
    setCommodityUrl() {
      return `${goodsList_String}`
    },
  },
  created() {
    this.getBackCategorys()
    this.getBrandList()
  },
  methods: {
    jumpEditPage(id) {
      this.$router.push({
        path: `/product/single-info/edit/${id}`,
      })
    },
    jumpShowPage(id) {
      this.$router.push({
        path: `/product/single-info/detail/${id}`,
      })
    },
    // 设置搜索表单值
    getBrandList() {
      getBrandList({page: 1, size: 999}).then(({payload}) => {
        const {content = []} = payload
        const brandList = content.map(item => {
          return {
            value: item.id,
            label: item.chineseName,
          }
        })
        this.$set(
          this.$refs.dataTable &&
            this.$refs.dataTable.$refs.searchForm &&
            this.$refs.dataTable.$refs.searchForm.options,
          'brandId',
          brandList,
        )
      })
    },
    // 设置搜索表单值
    getBackCategorys() {
      getBackCategorys({typeCode: 1}).then(({payload}) => {
        const categoryList = payload
          .filter(item => {
            return item.leaf === true || item.level === 2
          })
          .map(item => {
            return {
              value: item.id,
              label: item.name,
            }
          })
        this.$set(
          this.$refs.dataTable &&
            this.$refs.dataTable.$refs.searchForm &&
            this.$refs.dataTable.$refs.searchForm.options,
          'categoryId',
          categoryList,
        )
      })
    },
  },
}
</script>
<style lang="less">
@import '~^domain-goods/styles/var.less';
@import '~^domain-goods/styles/status.less';

.brand-management {
  padding: 20px;

  .el-date-editor .el-range-separator {
    margin-right: 4px;
  }

  .text-danger-button {
    color: @--color-danger;
  }
}
</style>
