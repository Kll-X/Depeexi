<template>
  <div class="page">
    <div>
      <Manual v-if="isRouterAlive"></Manual>
    </div>
  </div>
</template>

<script>
import Manual from './index'

export default {
  components: {
    Manual,
  },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  provide() {
    return {
      reload: this.reload,
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    },
  },
}
</script>

<style scoped lang=""></style>
