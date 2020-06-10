<template>
  <div class="empty-wrapper">
    <p class="empty-img"></p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'NoData',
}
</script>

<style lang="less" scoped>
.empty-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .empty-img {
    width: 200px;
    height: 200px;
    margin: 30px 0;
    background: url('//deepexi.oss-cn-shenzhen.aliyuncs.com/deepexi-services-dashboard/no_data.svg')
      no-repeat center / cover;
  }
}
</style>
