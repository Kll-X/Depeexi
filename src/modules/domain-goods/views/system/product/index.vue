<template>
  <div class="product">
    <div class="product__content">
      <el-radio-group
        v-show="show"
        v-model="currentRoute"
        size="medium"
        class="product__nav"
        @change="navChange"
      >
        <el-radio-button label="/system/product/brand"
          >商品品牌</el-radio-button
        >
        <el-radio-button label="/system/product/property"
          >商品属性</el-radio-button
        >
        <el-radio-button label="/system/product/category/back"
          >商品后台类目</el-radio-button
        >
        <el-radio-button label="/system/product/category/front"
          >商品前台类目</el-radio-button
        >
      </el-radio-group>
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
import {RadioButton} from 'element-ui'
const routerList = [
  '/system/product/brand',
  '/system/product/property',
  '/system/product/category/back',
  '/system/product/category/front',
]

export default {
  components: {
    ElRadioButton: RadioButton,
  },
  data() {
    return {
      currentRoute: this.$route.path,
      show: true,
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(path) {
        // this.currentRoute = path
        // 保留
        // 假如是子路由，保持选中父路由
        const route = routerList.find(item => {
          if (path.includes('detail')) {
            this.show = false
          } else {
            this.show = true
          }
          return path.includes(item)
        })
        this.currentRoute = route
      },
    },
  },
  methods: {
    navChange(path) {
      this.$router.replace(path)
    },
  },
}
</script>

<style lang="less" scoped>
.product {
  width: 100%;

  &__content {
    width: 100%;
  }

  &__nav {
    white-space: nowrap;
    padding: 20px 0 10px 20px;
  }
}
</style>
