<template>
  <div class="decorate">
    <div class="decorate__content">
      <el-radio-group
        v-model="currentRoute"
        class="decorate__nav"
        @change="navChange"
      >
        <el-radio-button label="/system/decorate/banner"
          >Banner配置</el-radio-button
        >
        <el-radio-button label="/system/decorate/subject"
          >专题页配置</el-radio-button
        >
        <el-radio-button label="/system/decorate/billboards"
          >商品榜单配置</el-radio-button
        >
        <el-radio-button label="/system/decorate/recommendation"
          >精选规则</el-radio-button
        >
      </el-radio-group>
      <nuxt-child></nuxt-child>
    </div>

    <div v-loading="iframeLoading" class="mobile">
      <div class="mobile__content">
        <iframe
          :src="mobileAddress"
          frameborder="0"
          @load="iframeLoading = false"
        ></iframe>
      </div>
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
      iframeLoading: false,
      iframeQuery: '',
      currentRoute: this.$route.path,
    }
  },
  computed: {
    mobileAddress() {
      const isDev = process.env.MODE == 'dev'
      const origin = isDev ? 'http://dr.dev.deepexi.top' : location.origin
      const address = process.env.MOBILE_URL || `${origin}/mobile`

      return `${address}?timestamp=${this.iframeQuery}`
    },
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
  &__content {
    flex: 1;
    padding-right: 360px;
  }

  &__nav {
    padding: 20px 0 10px 20px;
  }

  .mobile {
    background: #f0f2f5;
    padding-left: 15px;
    height: auto;
    position: fixed;
    right: 0;
    top: 130px;
    bottom: 50px;

    &__content {
      background: #fff;
      height: 100%;
    }

    iframe {
      width: 360px;
      height: 100%;
    }
  }
}
</style>
