<template>
  <div class="brand-management">
    <el-data-table ref="dataTable" v-bind="tableconfig"></el-data-table>
  </div>
</template>

<script>
import {
  brandList_String,
  getBrandRelation,
  delBrandManagement,
} from '^domain-goods/services/commodity-center.js'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      tableconfig: {
        url: brandList_String,
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        deleteLoading: false,
        extraButtons: [
          {
            type: 'primary',
            text: '查看',
            atClick: row => {
              this.routerLinkToDetail(row.id)
              return Promise.resolve(false)
            },
          },
          {
            type: 'primary',
            text: '编辑',
            atClick: row => {
              this.routerLinkToEdit(row.id)
              return Promise.resolve(false)
            },
          },
          {
            type: 'danger',
            text: '删除',
            atClick: row => {
              this.$confirm('您确定要删除该品牌吗?', '提示', {
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
                    getBrandRelation({id})
                      .then(({payload}) => {
                        if (payload) {
                          this.$message.error('已有关联信息，无法删除')
                          done()
                          instance.confirmButtonLoading = false
                          return
                        }
                        delBrandManagement(row.id)
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
          },
        ],
        operationAttrs: {
          width: '120px',
          fixed: 'right',
        },
        headerButtons: [
          {
            type: 'primary',
            text: '新增品牌',
            atClick: row => {
              this.routerLinkToNew()
              return Promise.resolve(false)
            },
          },
        ],
        columns: [
          {
            minWidth:120,
            prop: 'code',
            label: '品牌编码',
            'show-overflow-tooltip': true,
          },
          {
            minWidth:120,
            prop: 'chineseName',
            label: '品牌中文名称',
            'show-overflow-tooltip': true,
          },
          {
            minWidth:150,
            prop: 'englishName',
            label: '品牌英文名称',
            'show-overflow-tooltip': true,
          },
          {
            minWidth:150,
            prop: 'updatedTime',
            label: '更新时间',
            formatter: (_, __, value) =>
              dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            minWidth:120,
            prop: 'attachmentPath',
            label: 'LOGO',
            formatter: row => {
              let srcUrl = row.attachmentPath
              return !!srcUrl ? <img class="srcUrl" src={srcUrl} /> : ''
            },
          },
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '品牌名称',
            $el: {
              placeholder: '请输入',
              clearable: true,
            },
          },
        ],
      },
    }
  },
  methods: {
    routerLinkToNew() {
      this.$router.push({
        path: '/system/product/brand/new',
      })
    },
    routerLinkToEdit(id) {
      this.$router.push({
        path: `/system/product/brand/edit/${id}`,
      })
    },
    routerLinkToDetail(id) {
      this.$router.push({
        path: `/system/product/brand/detail/${id}`,
      })
    },
  },
}
</script>
<style lang="less" scoped>
.brand-management {
  padding: 20px;

  .srcUrl {
    width: 40px;
    height: 40px;
  }

  .brand-management {
    background: #fff;
    padding: 10px;
  }
}
</style>
