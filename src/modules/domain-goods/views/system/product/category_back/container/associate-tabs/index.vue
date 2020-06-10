<template>
  <div class="associate-tabs-container">
    <!-- <el-tabs>
      <el-tab-pane label="配置属性关联">
        <Attribute :category-id="categoryId" />
      </el-tab-pane>
      <el-tab-pane label="配置品牌关联">
        <Brand :category-id="categoryId" />
      </el-tab-pane>
    </el-tabs>-->
    <div class="header">配置属性关联</div>
    <div class="content">
      <Attribute :category-id="categoryId" />
    </div>
  </div>
</template>

<script>
// import Brand from './container/brand'
import Attribute from './container/attribute/index'

export default {
  name: 'AssociateTabs',
  components: {
    // Brand,
    Attribute,
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
