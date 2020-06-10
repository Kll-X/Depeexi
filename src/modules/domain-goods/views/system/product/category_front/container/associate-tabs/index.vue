<template>
  <div class="associate-tabs-container">
    <!-- <el-tabs>
      <el-tab-pane label="添加后台类目">
        <AssociationBaseCategory :category-id="categoryId" />
      </el-tab-pane>
    </el-tabs>-->
    <div class="header">添加后台类目</div>
    <div class="content">
      <AssociationBaseCategory :category-id="categoryId" />
    </div>
  </div>
</template>

<script>
import AssociationBaseCategory from './container/association-base-category'

export default {
  name: 'AssociateTabs',
  components: {
    AssociationBaseCategory,
  },
  props: {
    categoryId: {
      type: [Number, String],
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.associate-tabs-container {
  padding: 0 20px;

  .header {
    color: #2d303b;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
}
</style>
