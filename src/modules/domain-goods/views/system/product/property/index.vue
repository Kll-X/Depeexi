<template>
  <div class="property-manage-container">
    <el-data-table ref="dataTable" v-bind="tableConfig"></el-data-table>
  </div>
</template>
<script>
import {
  commodityPropertyList_String,
  deleteProperties,
  putCommodityPropertys,
  getCommodityPropertysExistRelation,
} from '^domain-goods/services/commodity-center.js'
import {
  INPUT_TYPE,
  STATUS_OPTIONS__PROPERTY,
} from '^domain-goods/const/dictionary.js'
import {ArrayToObject} from '^domain-goods/const/array-to-object.js'
import dayjs from 'dayjs'
const dangerColor = '#E24156'

export default {
  data() {
    return {
      tableConfig: {
        firstPage: 1,
        hasDialog: false,
        hasPagination: true,
        // isTree: true,
        url: commodityPropertyList_String,
        hasNew: false,
        hasEdit: false,
        hasView: false,
        hasDelete: false,
        headerButtons: [
          {
            type: 'primary',
            text: '新增属性',
            atClick: this.addProperty,
          },
        ],
        extraButtons: [
          {
            text: '查看',
            atClick: this.detailItem,
          },
          {
            text: '编辑',
            atClick: this.editItem,
          },
          {
            text: '删除',
            style: {color: dangerColor},
            show: row => {
              return row.status === 1 ? false : true
            },
            atClick: this.deleteItem,
          },
          // 属性状态，保留
          // {
          //   text: row => {
          //     return row.status === 1 ? '禁用' : '启用'
          //   },
          //   atClick: this.changeStatus,
          // },
        ],
        operationAttrs: {
          width: '120px',
          fixed: 'right',
        },
        columns: [
          {
            minWidth: 120,
            prop: 'propertyCode',
            label: '属性编码',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'propertyName',
            label: '属性名称',
            'show-overflow-tooltip': true,
          },
          {
            minWidth: 120,
            prop: 'inputType',
            label: '输入方式',
            formatter: row => {
              const {inputType} = row
              for (let item of INPUT_TYPE) {
                if (inputType == item.value) {
                  return item.label
                }
              }
              return inputType
            },
          },
          {
            minWidth: 120,
            prop: 'propertyValue',
            label: '属性值',
            formatter: row => {
              const propertyValue = row.propertyValue || []
              return propertyValue.map(v => v.propertyValue).join(',')
            },
            'show-overflow-tooltip': true,
          },
          // 属性状态，保留
          // {
          //   prop: 'status',
          //   label: '状态',
          //   formatter: (_, __, value) => {
          //     if (STATUS_OPTIONS__PROPERTY[value]) {
          //       const {label, className} = STATUS_OPTIONS__PROPERTY[value]
          //       return <span class={`status-text ${className}`}>{label}</span>
          //     }
          //     return <span>{value}</span>
          //   },
          //   // formatter: row => {
          //   //   return row.status === 1 ? '启用' : '禁用'
          //   // },
          // },
          {
            minWidth: 150,
            prop: 'updatedTime',
            label: '更新时间',
            formatter: (_, __, value) =>
              dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'propertyName',
            label: '属性名称',
            $el: {
              placeholder: '请输入',
              clearable: true,
            },
          },
        ],
        form: [],
      },
    }
  },
  methods: {
    // 删除单个表单项
    deleteItem(row) {
      this.$confirm('您确定要删除该属性吗?', '提示', {
        confirmButtonLoading: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'message-box',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const {id} = row
            // 删除前判断是否有关联商品
            getCommodityPropertysExistRelation({ids: [id]})
              .then(({payload}) => {
                if (payload) {
                  this.$message.error('已有关联信息，无法删除')
                  done()
                  instance.confirmButtonLoading = false
                  return
                }
                deleteProperties({id})
                  .then(() => {
                    this.$message.success('删除成功')
                    this.$refs.dataTable.getList()
                  })
                  .finally(res => {
                    done()
                    instance.confirmButtonLoading = false
                  })
              })
              .catch(() => {
                instance.confirmButtonLoading = false
              })
            return
          }
          done()
        },
      }).catch(() => {})

      return Promise.resolve(false)
    },
    // 启用 or 禁用
    // 属性状态，保留
    // async changeStatus(item) {
    //   const {id, status} = item
    //   await putCommodityPropertys({id, status: status === 1 ? 0 : 1}).then(
    //     res => {
    //       this.$message.success(`${status === 1 ? '禁用' : '启用'}成功`)
    //       this.$refs.dataTable.getList()
    //     },
    //   )
    //   return Promise.resolve(false)
    // },
    // 查看详情页
    detailItem(item) {
      const {id} = item
      this.$router.push({
        path: `/system/product/property/detail/${id}`,
      })
      return Promise.resolve(false)
    },
    // 修改单个表单项
    editItem(item) {
      const {id} = item
      this.$router.push({
        path: `/system/product/property/edit/${id}`,
      })
      return Promise.resolve(false)
    },
    // 增加属性
    addProperty() {
      this.$router.push({
        path: `/system/product/property/new`,
      })
      return Promise.resolve(false)
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/status.less';

.property-manage-container {
  padding: 20px;
}
</style>
