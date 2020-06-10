<template>
  <div class="associated">
    <el-data-table ref="table" v-bind="tableConfig" class="data-table">
      <el-table-column label="操作">
        <template slot="default" slot-scope="scope">
          <el-button
            :class="{
              'el-alert--error': judgeIfAssociate(scope.row) === '取消关联',
            }"
            type="text"
            size="small"
            @click="brandBtn(scope.row, scope.$index)"
          >{{ judgeIfAssociate(scope.row) }}</el-button>
        </template>
      </el-table-column>
    </el-data-table>
    <div class="associated-footer">
      <el-button @click="cancelChange" size="small">取消</el-button>
      <el-button
        :loading="confirmButtonLoading"
        type="primary"
        :disabled="!associatedList || associatedList.length === 0"
        @click="saveFormValue"
        size="small"
      >确认</el-button>
    </div>
  </div>
</template>

<script>
import {ATTRIBUTE_TYPES} from '^domain-goods/const/dictionary.js'
import TreeDate from '^domain-goods/const/tree.js'
import {
  postCategoryPropertyRelationShip,
  backCategoryPropertyNotRelation_String,
} from '^domain-goods/services/commodity-center.js'

export default {
  props: {
    categoryId: {
      type: [String, Number],
      required: true,
    },
    ifUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const currentUrl = backCategoryPropertyNotRelation_String({
      id: this.categoryId,
    })
    return {
      currentUrl,
      confirmButtonLoading: false,
      tableConfig: {
        url: currentUrl,
        dataPath: 'payload.content',
        columns: 'columns',
        hasNew: false,
        hasEdit: false,
        isTree: true,
        hasOperation: false,
        hasPagination: true,
        hasDelete: false,
        tableAttrs: {
          // 'max-height': 400,
        },
        columns: [
          {
            prop: 'propertyName',
            label: '属性名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'propertyValue',
            label: '属性值',
            formatter: row => {
              const propertyValue = row.propertyValue || []
              return propertyValue.map(v => v.propertyValue).join(',')
            },
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
        searchForm: [
          {
            $type: 'input',
            $id: 'propertyName',
            $el: {
              placeholder: '请输入属性名称',
              clearable: true,
            },
          },
        ],
      },
      associatedList: [],
      toggle: false,
    }
  },
  computed: {
    showSave() {
      return !!this.associatedList.length
    },
    userInfo() {
      const {tenantId, appId} = this.$store.state.user
      return {
        tenantId,
        appId,
      }
    },
  },
  watch: {
    ifUpdate(val) {
      if (val) {
        this.updateTableData()
      }
    },
    categoryId() {
      this.$nextTick(_ => {
        this.tableConfig.url = backCategoryPropertyNotRelation_String({
          id: this.categoryId,
        })
      })
    },
  },
  methods: {
    setChangeArrtibute(data) {
      this.$set(data, 'isEnabled', !!data.isEnabled ? true : false)
    },
    brandBtn(data, index) {
      const newTreeDate = new TreeDate()
      const treeArray = newTreeDate.treeToArray([data])
      const associatedList = this.associatedList

      let ifAssociated = false // 是否已经被关联
      for (let item of associatedList) {
        if (item.id === data.id) {
          ifAssociated = true
          break
        }
      }
      // 如果数据在数组中的话，那则移除该数据
      if (ifAssociated) {
        // 移除当前以及子项的选中状态
        this.associatedList = associatedList.filter(info => {
          for (let item of treeArray) {
            if (info.id === item.id) {
              return false
            }
          }
          return true
        })
      } else {
        // 添加当前以及子项的选中状态

        // 将那些未选中的过滤出来
        let newAddsociated = treeArray.filter(info => {
          for (let item of associatedList) {
            if (info.id === item.id) {
              return false
            }
          }
          return true
        })
        this.associatedList = associatedList.concat(newAddsociated)
      }
      this.$nextTick(() => {
        this.$set(this.$refs.table.data, index, data)
      })
    },
    saveFormValue() {
      // 获取当前选中的项
      const saveArr = this.associatedList.map(info => {
        return {
          categoryId: this.categoryId,
          propertyId: info.id,
          // propertyGroupId: null,
          propertyCode: info.propertyCode,
          propertyTypes: 3,
          required: true,
          ...this.userInfo,
        }
      })
      this.confirmButtonLoading = true
      // this.categoryId,
      postCategoryPropertyRelationShip(saveArr)
        .then(() => {
          this.$message.success('批量添加属性关联成功')
          // 进行数据刷新
          this.updateTableData()
          this.$emit('post-success')
          this.cancelChange()
        })
        .finally(() => {
          this.confirmButtonLoading = false
        })
    },
    cancelChange() {
      // 清除
      // 将当前的选中数组置空
      this.associatedList = []
      this.$emit('cancel-change')
    },
    judgeIfAssociate(data) {
      for (let item of this.associatedList) {
        if (item.id === data.id) {
          return '取消关联'
        }
      }
      return '添加关联'
    },
    // 更新table数据
    updateTableData() {
      this.$refs.table.getList()
    },
  },
}
</script>
<style scoped lang="less">
@import '~^domain-goods/styles/var.less';

.associated {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .associated-footer {
    width: 100%;
    margin: 0 -20px -20px;
    box-sizing: content-box;
    padding: 10px 20px 10px;
    background: @color__buttons-group-bg;
    text-align: center;
  }

  .el-alert--error {
    color: @--color-danger;
  }
}
</style>
