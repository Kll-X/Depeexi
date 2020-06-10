<template>
  <p class="operate-row">
    <slot></slot>
  </p>
</template>

<script>
export default {}
</script>

<style lang="less">
.operate-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background: rgba(244, 246, 250, 1);
}
</style>
