<template>
  <div class="association-base-container">
    <el-data-table
      class="data-table-container"
      ref="table"
      v-bind="tableconfig"
      :url="getFrontCategoryRelationshipWithBackUrl"
      @update="updateOriginData"
    ></el-data-table>
    <div v-show="this.delDataList && this.delDataList.length > 0" class="associated-footer">
      <el-button @click="cancelChange">取消</el-button>
      <el-button :loading="delConfirmButtonLoading" type="primary" @click="deleteHandle">确认</el-button>
    </div>
    <el-drawer
      class="association-back"
      title="添加后台类目"
      @close="clearValue"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="60%"
    >
      <div>
        <el-tree
          v-loading="treeLoading"
          ref="associated"
          :data="notAssociated"
          :props="defaultProps"
          default-expand-all
          class="associated-tree"
          :check-strictly="true"
          node-key="id"
          show-checkbox
          @check-change="checkChange"
        ></el-tree>
      </div>
      <el-row class="drawer-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          :disabled="value && value.length === 0"
          :loading="confirmButtonLoading"
          type="primary"
          @click="getRightUncheckedData"
        >确认</el-button>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
import {
  getFrontCategoryRelationshipWithBack_String,
  postCategoryRelationshipBatch,
  delCategoryRelationshipBatch,
  getBackCategoryNoRelationWithFront,
} from '^domain-goods/services/commodity-center.js'

export default {
  name: 'AssociationBaseContainer',
  props: {
    categoryId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      treeLoading: false,
      value: [],
      titles: ['后台类目', '已选择'],
      dialogVisible: false,
      notAssociated: [],
      defaultProps: {
        key: 'id',
        label: 'name',
        children: 'children',
      },
      confirmButtonLoading: false,
      delConfirmButtonLoading: false,
      tableconfig: {
        hasPagination: false,
        hasNew: false,
        isTree: false,
        hasEdit: false,
        hasOperation: true,
        hasDelete: false,
        extraButtons: [
          {
            type: 'danger',
            text: '删除',
            class: 'delete-button',
            atClick: row => {
              this.deleteItem(row)
              return Promise.resolve(false)
            },
          },
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '添加后台类目',
            atClick: row => {
              this.dialogVisible = true
              return Promise.resolve(false)
            },
          },
        ],
        columns: [
          {
            prop: 'baseCategoryId',
            label: '类目编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'name',
            label: '类目名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
        // onDelete: selected => {
        //   return delCategoryRelationshipBatch([selected.id]).then(() => {
        //     this.getNotAssociated()
        //   })
        // },
      },
      originData: [],
      delDataList: [],
    }
  },
  watch: {
    categoryId(val) {
      if (val) {
        this.getNotAssociated()
      }
    },
  },
  computed: {
    getFrontCategoryRelationshipWithBackUrl() {
      return getFrontCategoryRelationshipWithBack_String(this.categoryId)
    },
    userInfo() {
      const {tenantId, appId} = this.$store.state.user
      return {
        tenantId,
        appId,
      }
    },
  },
  created() {
    this.getNotAssociated()
  },
  methods: {
    // 确认删除
    deleteHandle() {
      this.delConfirmButtonLoading = true
      delCategoryRelationshipBatch(this.delDataList.slice(0))
        .then(() => {
          this.getNotAssociated()
          this.$refs.table.getList()
        })
        .finally(() => {
          this.delConfirmButtonLoading = false
        })
    },
    updateOriginData(val) {
      this.originData = val.slice(0)
      this.delDataList = []
    },
    // 取消更改
    cancelChange() {
      // 清空选中项，选中删除项
      this.$refs.table.data = this.originData
      this.delDataList = []
    },
    // 删除表单项
    deleteItem(row) {
      const tableData = this.$refs.table.data
      const newData = tableData.filter(info => info.id !== row.id)
      this.delDataList.push(row.id)
      this.$refs.table.data = newData
    },
    checkChange() {
      this.value = this.$refs.associated.getCheckedNodes(false) // 所有节点
    },
    clearValue() {
      this.value = []
    },
    getNotAssociated() {
      this.treeLoading = true
      getBackCategoryNoRelationWithFront({
        id: this.categoryId,
        enabled: true,
      })
        .then(({payload}) => {
          this.notAssociated = payload
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    getRightUncheckedData() {
      this.confirmButtonLoading = true
      const params = this.value.map(v => {
        return {
          name: v.name,
          baseCategoryId: v.id,
          frontCategoryId: this.categoryId,
          id: v.id,
          ...this.userInfo,
        }
      })
      postCategoryRelationshipBatch(params)
        .then(res => {
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.$refs.table.getList()
          this.getNotAssociated()
        })
        .finally(() => {
          this.confirmButtonLoading = false
        })
    },
  },
}
</script>
<style scoped lang="less">
@import '~^domain-goods/styles/var.less';
.associated-footer {
  width: 100%;
  margin: 20px 0px -20px;
  box-sizing: content-box;
  padding: 10px 0px;
  background: @color__buttons-group-bg;
  text-align: center;
}
.drawer-footer {
  width: 100%;
  margin: 0 -20px -20px;
  box-sizing: content-box;
  padding: 10px 20px;
  background: @color__buttons-group-bg;
  text-align: center;
}
.srcUrl {
  width: 60px;
  height: 60px;
}
</style>
<style lang="less">
.association-back {
  #el-drawer__title {
    font-size: 16px;
    color: #2d303b;
    margin-bottom: 0;
  }
  .el-drawer__body {
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .associated-tree {
    vertical-align: top;
    width: 500px;
    display: inline-block;
  }
}
.association-base-container {
  .data-table-container {
    .el-form {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
