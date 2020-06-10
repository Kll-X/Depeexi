<template>
  <div class="sort-tree-container">
    <div class="title">列表</div>
    <SearchInput
      class="search-input-container"
      @select="selectItem"
      @emptyInput="getRootList"
    />
    <!-- <div class="button-container">
      <el-button type="primary" size="small" @click="dialogVisible = true">新增根类目</el-button>
    </div>-->
    <el-tree
      v-loading="loadRootData"
      ref="tree"
      :data="data"
      :load="getSelectList"
      :allow-drop="ifAllowDrop"
      :props="defaultProps"
      :highlight-current="true"
      node-key="id"
      draggable
      lazy
      @node-click="nodeClickFn"
      @node-drop="nodeDropSuccess"
    >
      <span
        slot-scope="{node, data}"
        :class="{'custom-tree-node': true, 'node-bg': node.level === 1}"
      >
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-show="!Boolean(+data.leaf) && node.level < 3"
            class="icon-button"
            type="text"
            @click.stop="() => appendItem(data)"
          >
            <!-- <i class="el-icon-circle-plus-outline"></i> -->
            <svg-icon icon-class="houtai-tianjia" />
          </el-button>
          <el-button
            type="text"
            class="delete-button"
            @click.stop="() => removeItem(data)"
          >
            <!-- <i class="el-icon-delete"></i> -->
            <svg-icon icon-class="houtai-shanchu" />
          </el-button>
        </span>
      </span>
    </el-tree>
    <div class="button-container">
      <el-button type="text" size="small" @click="dialogVisible = true">
        <svg-icon icon-class="houtai-tianjia" />新增根类目
      </el-button>
    </div>

    <!-- 新增类目 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增类目"
      @close="clearValue"
    >
      <el-form-renderer
        ref="addCategoryForm"
        :content="content"
        label-width="100px"
      ></el-form-renderer>
      <div slot="footer" class="buttons-group">
        <el-button @click="clearValue">取消</el-button>
        <el-button
          :loading="confirmButtonLoading"
          type="primary"
          @click="saveForm"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SearchInput from './container/search-input'
import {Tree} from 'element-ui'
import {
  getBackCategorys,
  postAfterCategorysList,
  delAfterCategorysList,
  putAfterCategorysListBatch,
  getCheckBeforeDeleteBack,
} from '^domain-goods/services/commodity-center.js'
const typeCode = 1 // typeCode{1:后台,0:前台}

export default {
  name: 'SortTree',
  components: {
    SearchInput,
    [Tree.name]: Tree,
  },
  data() {
    return {
      confirmButtonLoading: false,
      data: [],
      content: [
        {
          $id: 'name',
          $type: 'input',
          label: '类目名称',
          $el: {
            style: 'width:35%',
            placeholder: '请输入',
            // maxlength: 32,
          },
          rules: [
            {
              message: '请输入类目名称',
              required: true,
              trigger: ['change', 'blur'],
              whitespace: true,
              // maxlength: 32,
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['change', 'blur'],
            },
          ],
        },
        {
          $id: 'enabled',
          $type: 'switch',
          label: '是否启用',
          $default: true,
          $el: {
            placeholder: '请输入',
          },
        },
        {
          $id: 'leaf',
          $type: 'radio-group',
          label: '叶子节点',
          $default: '0',
          $el: {
            placeholder: '请输入',
          },
          $options: [
            // 注意：element radio-group 通过 label 而不是 value 来匹配值
            {label: '是', value: '1'},
            {label: '否', value: '0'},
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return Boolean(+data.leaf) || node.level > 2
        },
      },
      dialogVisible: false, // 显示新增类目弹窗
      parentNode: {}, // 选中的父节点
      loadRootData: false, // 请求根节点列表
    }
  },
  methods: {
    selectCurrentKey(id) {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCurrentKey(id)
      })
    },
    appendItem(data) {
      this.dialogVisible = true
      if (data.level === 1) {
        this.$nextTick(() => {
          this.$refs.addCategoryForm.setOptions('leaf', [
            {
              label: '是',
              value: '1',
            },
          ])
          this.$refs.addCategoryForm.updateForm({
            leaf: '1',
          })
        })
      }
      this.parentNode = data
    },
    // Input选中值触发的数据 // todo 没必要重新获取数据
    async selectItem(item) {
      const {id} = item
      this.loadRootData = true
      const res = await getBackCategorys({id, typeCode}) // typeCode{0:后台,1:前台}
      this.data = res.payload
      this.loadRootData = false
    },
    // 删除某一项
    removeItem(item) {
      const {id, children} = item
      let confrimMess =
        children && children.length
          ? '当前节点下包含叶子节点，是否全部删除？'
          : '是否删除当前节点?'
      this.$confirm(confrimMess, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            // 删除前判断是否有关联商品
            getCheckBeforeDeleteBack({backCategoryId: id})
              .then(({payload}) => {
                if (!payload) {
                  this.$message.error('已有关联信息，无法删除')
                  done()
                  instance.confirmButtonLoading = false
                  return
                }
                delAfterCategorysList({id})
                  .then(() => {
                    this.$message.success('删除成功')
                    this.getRootList()
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
    },
    // 请求选择列表
    async getSelectList(node, resolve) {
      const {id} = node.data
      if (!id) this.loadRootData = true
      const {payload} = await getBackCategorys({parentId: id || 0, typeCode})
      this.loadRootData = false
      if (payload) {
        const sortPayload = payload.sort(this.compare('sort'))
        if (!id && sortPayload[0]) {
          // 默认选中第一个
          this.nodeClickFn(sortPayload[0])
          this.selectCurrentKey(sortPayload[0].id)
        }
        resolve(sortPayload)
      } else {
        resolve([])
      }
    },
    // 获取根节点数据
    async getRootList() {
      this.loadRootData = true
      const res = await getBackCategorys({parentId: 0, typeCode})
      this.loadRootData = false
      const {payload} = res
      if (payload) {
        const sortPayload = payload.sort(this.compare('sort'))
        if (sortPayload[0]) {
          this.nodeClickFn(sortPayload[0])
          this.selectCurrentKey(sortPayload[0].id)
        }
        this.data = sortPayload
      } else {
        this.data = []
      }
      this.clearValue()
    },
    // 升序排序
    compare(propertyName) {
      return (before, next) => {
        const beforeValue = before[propertyName]
        const nextValue = next[propertyName]
        if (beforeValue > nextValue) {
          return 1
        } else if (beforeValue < nextValue) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 清除弹窗中选中的数据
    clearValue() {
      this.dialogVisible = false
      this.parentNode = {}
      try {
        this.$refs.addCategoryForm.resetFields()
      } catch {}
    },
    // 保存添加节点
    saveForm() {
      const {level, path, id} = this.parentNode
      const value = this.$refs.addCategoryForm.getFormValue()
      this.$refs.addCategoryForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          const categoryForm = {
            ...value,
            leaf: Boolean(+value.leaf), //是否叶子节点
            enabled: !!value.enabled,
            level: level !== undefined ? Number(level) + 1 : 0, // 默认为根节点
            path: path ? `/${path}` : '/', // 默认为根节点
            parentId: id || 0, // 默认为根节点
            typeCode, // typeCode{0:后台,1:前台}
          }
          this.confirmButtonLoading = true
          postAfterCategorysList(categoryForm)
            .then(async res => {
              this.$message.success('添加成功')
              this.dialogVisible = false
              this.getRootList()
            })
            .catch(() => {})
            .finally(() => {
              this.confirmButtonLoading = false
            })
        }
      })
    },
    // 点击节点事件触发
    nodeClickFn(item) {
      const {id} = item
      this.$emit('selectNode', item)
    },
    // 是否允许放置节点
    ifAllowDrop(draggingNode, dropNode, type) {
      if (type === 'inner') return false
      const {parentId} = draggingNode.data
      const nextParentId = dropNode.data.parentId
      return parentId === nextParentId
    },
    // 放置成功的事件
    nodeDropSuccess(before, after, inner) {
      const {parent} = after
      const dataList =
        parent && parent.childNodes
          ? parent.childNodes.map((info, index) => {
              const detail = info.data || {}
              delete detail.updatedTime
              delete detail.createdTime
              return {
                ...detail,
                sort: index,
              }
            })
          : []
      if (!dataList.length) return
      putAfterCategorysListBatch(dataList).then(res => {
        this.$message.success('修改成功')
      })
    },
  },
}
</script>

<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.sort-tree-container {
  overflow: hidden;

  .title {
    font-weight: 500;
    font-size: 14px;
    margin-left: 10px;
    color: #2d303b;

    &::before {
      display: inline-block;
      width: 4px;
      height: 12px;
      background: #575962;
      border-radius: 3px;
      content: '';
      margin-right: 6px;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    // padding-right: 8px;
    // width: 100%; // 不能使用100%宽度，必须减掉三角宽度，否则会超出
    width: calc(100% - 24px);

    span:first-child {
      // width: 130px;
      display: inline-block;
      padding: 2px 10px;
      border-radius: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .node-bg {
    span:first-child {
      background: #f0f2f5;
      line-height: 16px;
    }
  }

  .search-input-container {
    box-sizing: border-box;
    padding: 15px 10px;
    width: 100%;
  }

  .button-container {
    // padding: 5px 10px 20px;
    padding: 20px 5px;
  }

  .buttons-group {
    text-align: right;
    background: #f4f6fa;
    padding: 10px 20px;
    margin: -10px -20px -20px;
  }

  .delete-button {
    color: @--color-danger;
    margin-left: 6px;
  }
}
</style>
<style lang="less">
.sort-tree-container {
  // 被 stylelint 要求挪动至此
  .el-tree-node__content {
    // padding-bottom: 10px ;
    height: 32px;
  }

  .el-tree--highlight-current {
    .el-tree-node.is-current > .el-tree-node__content {
      color: #2878ff;
      background: none;
    }
  }
}
</style>
