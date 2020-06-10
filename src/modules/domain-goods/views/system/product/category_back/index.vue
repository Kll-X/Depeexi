<template>
  <div class="product-category_back">
    <!-- <el-row :gutter="0"> -->
    <div :span="5" class="tree-box">
      <SortTree ref="sortTree" class="tree-container" @selectNode="selectNode" />
    </div>
    <div v-if="categoryId !== null" :span="19" class="detail-box">
      <div class="detail-container">
        <CategoryInfo :category-id="categoryId" @change="changeInfo" />
        <AssociateTabs :category-id="categoryId" />
      </div>
    </div>
    <!-- </el-row> -->
  </div>
</template>

<script>
import SortTree from './container/sort-tree/index'
import CategoryInfo from './container/category-info'
import AssociateTabs from './container/associate-tabs/index'

export default {
  name: 'ProductCategoryBack',
  components: {
    SortTree,
    CategoryInfo,
    AssociateTabs,
  },
  data() {
    return {
      categoryId: null,
    }
  },
  methods: {
    // 选中node节点
    selectNode(node) {
      const {id} = node
      this.categoryId = id
    },
    // 更改信息详情
    changeInfo(info) {
      this.$refs.sortTree.getRootList()
    },
  },
}
</script>

<style scoped lang="less">
@import '~^domain-goods/styles/var.less';

.product-category_back {
  display: flex;
  overflow-x: auto;
  padding-bottom: 20px;
  min-height: 600px;

  .tree-box {
    width: 0;
    flex: 0 1 275px;
    min-width: 200px;
    margin-right: 20px;
    border-right: 1px solid @--border-color-base;

    .tree-container {
      padding: 20px 30px 20px 20px;
    }
  }

  .detail-box {
    width: 0;
    flex: 4 0 400px;
    .detail-container {
      background-color: #fff;
    }
  }
}
</style>
