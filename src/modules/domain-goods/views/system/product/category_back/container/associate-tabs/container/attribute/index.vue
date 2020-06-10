<template>
  <div class="attribute-container">
    <el-data-table
      ref="table"
      class="data-table-container"
      v-bind="tableConfig"
      @update="updateTableValue"
    >
      <el-table-column label="属性类型" min-width="120">
        <template slot="default" slot-scope="scope">
          <el-select
            v-model="scope.row.propertyTypes"
            placeholder="请选择"
            @change="changeProperty(scope.row, $event)"
          >
            <el-option
              v-for="item of attributeTypes"
              :key="item.i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否必填" min-width="120">
        <template slot="default" slot-scope="scope">
          <el-select
            v-model="scope.row.required"
            placeholder="请选择"
            @change="changeRequire(scope.row, $event)"
          >
            <el-option
              v-for="item of ifRequired"
              :key="item.i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-data-table>
    <div v-show="showSave" class="associated-footer">
      <el-button @click="cancelChange">取消</el-button>
      <el-button :loading="confirmButtonLoading" type="primary" @click="saveChange">确认</el-button>
    </div>
    <el-drawer
      title="添加关联属性"
      class="association-property"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="60%"
    >
      <associated
        :category-id="categoryId"
        :if-update="dialogVisible"
        @post-success="updateTableData"
        @cancel-change="dialogVisible = false"
      ></associated>
    </el-drawer>
  </div>
</template>

<script>
import {ATTRIBUTE_TYPES} from '^domain-goods/const/dictionary.js'
import Associated from './associated'
import {
  backCategoryPropertyRelation_String,
  putCategoryPropertyRelationShipBatch,
  deleteCategoryPropertyRelationShipBatch,
} from '^domain-goods/services/commodity-center.js'
import TreeData from '^domain-goods/const/tree.js'

const IF_REQUIRED = [
  {
    label: '是',
    value: true,
  },
  {
    label: '否',
    value: false,
  },
]
export default {
  components: {
    Associated,
  },
  props: {
    categoryId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    // const emptyGroupItem = {
    //   name: '无',
    //   id: 0,
    // }
    const currentUrl = backCategoryPropertyRelation_String({
      id: this.categoryId,
    })
    return {
      confirmButtonLoading: false,
      // emptyGroupItem,
      dialogVisible: false,
      attributeTypes: ATTRIBUTE_TYPES, // 属性类型
      ifRequired: IF_REQUIRED, // 是否必填

      tableConfig: {
        url: currentUrl,
        hasPagination: false,
        hasNew: false,
        hasDelete: false,
        isTree: true,
        hasEdit: false,
        hasOperation: true,
        headerButtons: [
          {
            type: 'primary',
            text: '添加关联属性',
            atClick: row => {
              this.associatedLink(row.id)
              return Promise.resolve(false)
            },
          },
        ],
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
        columns: [
          {
            prop: 'id',
            label: '属性编号',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'propertyName',
            label: '属性名',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
      },
      changeDataList: [], // 修改项
      delDataList: [], // 删除项
    }
  },
  computed: {
    showSave() {
      return !!this.changeDataList.length || !!this.delDataList.length
    },
  },
  watch: {
    categoryId() {
      this.$nextTick(() => {
        this.updateTableData()
        this.changeDataList = []
        this.delDataList = []
      })
    },
  },
  methods: {
    associatedLink(ele) {
      this.dialogVisible = true
    },
    // 更改属性类型
    changeProperty(row, val) {
      // 将更改的属性值存储到修改的数组中
      this.changeDataListFn(row, {propertyTypes: val})
    },
    // 更改是否必填
    changeRequire(row, val) {
      // 将更改的是否必填保存到修改的数组中
      // 判断数组中是否有，如果有的话，则修改，否则则新增
      this.changeDataListFn(row, {required: val})
    },
    changeDataListFn(row, val) {
      let newList = this.changeDataList.slice(0)
      let ifSelected = false // 是否已经在数组中
      for (let item of this.changeDataList) {
        if (item.id === row.id) {
          newList.push({
            ...item,
            ...val,
          })
          ifSelected = true
        }
      }
      if (!ifSelected) {
        newList.push({
          ...row,
          ...val,
        })
      }
      this.changeDataList = newList
    },
    // 更新Updata后的数据回调
    updateTableValue(data) {
      const $table = this.$refs.table
      const newTreeData = new TreeData()
      const treeArr = newTreeData.arrayToTree(data, {
        id: 'propertyId',
        parentId: 'parentId',
      })
      const tree2Array = $table.tree2Array(treeArr, false)
      // 将数据转为树结构
      $table.data = tree2Array
    },
    // 取消更改
    cancelChange() {
      // 重新请求数据
      // 清空选中项，选中删除项
      this.updateTableData()
      this.changeDataList = []
      this.delDataList = []
    },
    // 批量保存更改
    saveChange() {
      const changeDataList = this.changeDataList.map(info => {
        return {
          ...info,
          id: info.id,
          categoryId: info.categoryId,
          propertyTypes: info.propertyTypes,
          required: info.required,
        }
      })
      const delDataList = this.delDataList
      const changeIdStr = changeDataList.map(info => info.id).join(',')
      let propertyIds = delDataList.map(info => info.id).join(',') // 主键id列表
      const categoryId = this.categoryId
      const id = ''
      let promiseArr = []
      if (changeIdStr) {
        const newArr = changeDataList.map(({children, parent, ...obj}) => {
          delete obj.updatedTime
          delete obj.createdTime
          delete obj.property
          return {...obj}
        })
        // 更改ID数组
        promiseArr.push(putCategoryPropertyRelationShipBatch(newArr))
      }
      if (propertyIds) {
        // 删除ID数组
        promiseArr.push(
          deleteCategoryPropertyRelationShipBatch(
            propertyIds,
          ),
        )
      }
      this.confirmButtonLoading = true
      Promise.all(promiseArr)
        .then(arr => {
          this.$message.success('修改关联属性成功!')
          this.cancelChange()
        })
        .finally(res => {
          this.confirmButtonLoading = false
        })
    },
    // 删除表单项
    deleteItem(row) {
      const tableData = this.$refs.table.data
      const newTreeData = new TreeData()
      const arrayTree = newTreeData.treeToArray([row])
      const newData = tableData.filter(info => {
        for (let item of arrayTree) {
          if (info.id === item.id) {
            return false
          }
        }
        return true
      })
      let newDelDataList = this.delDataList
      arrayTree.forEach(info => {
        let ifIn = false
        // 去重
        for (let item of newDelDataList) {
          if (item.id === info.id) {
            ifIn = true
            break
          }
        }
        if (ifIn) return
        newDelDataList.push(info)
      })
      this.delDataList = newDelDataList
      this.$refs.table.data = newData
      // 遍历获取所有的子节点，
      return Promise.resolve(false)
    },
    // 更新table数据
    updateTableData() {
      const currentUrl = backCategoryPropertyRelation_String({
        id: this.categoryId,
      })
      this.tableConfig.url = `${currentUrl}?timestamp=${new Date().getTime()}`
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.attribute-container {
  .srcUrl {
    width: 60px;
    height: 60px;
  }

  .associated-footer {
    // padding: 10px 0 10px;
    // background: #fff;
    // text-align: center;
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px 10px;
    background: @color__buttons-group-bg;
    text-align: center;
  }

  .delete-button {
    color: @--color-danger;
  }
}
</style>
<style lang="less">
.attribute-container {
  .data-table-container {
    .el-form {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.association-property {
  #el-drawer__title{
    font-size: 16px;
    color: #2D303B;
  }
  .el-drawer__header {
    margin-bottom: 0px;
  }
  .el-drawer__body {
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
