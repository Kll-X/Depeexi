<template>
  <div class="decorate">
    <div class="decorate__content">
      <el-radio-group
        v-if="
          [
            '/system/account/user-management',
            '/system/account/role-management',
          ].includes($route.path)
        "
        v-model="currentRoute"
        class="decorate__nav"
        @change="navChange"
      >
        <el-radio-button label="/system/account/user-management"
          >用户管理</el-radio-button
        >
        <el-radio-button label="/system/account/role-management"
          >角色管理</el-radio-button
        >
      </el-radio-group>
      <nuxt-child></nuxt-child>
    </div>
  </div>
</template>

<script>
import {RadioButton} from 'element-ui'

export default {
  components: {
    ElRadioButton: RadioButton,
  },
  data() {
    return {
      currentRoute: this.$route.path,
    }
  },
  watch: {
    '$route.path'(path) {
      this.currentRoute = path
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
.decorate {
  &__nav {
    padding: 20px 0 10px 20px;
  }
}
</style>
