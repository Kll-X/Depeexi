<template>
  <div class="type-container">
    <div class="container-title">
      <span class="container-title__text">{{ title }}</span>
    </div>
    <div class="type-detail">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeContainer',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less">
@import '~^domain-goods/styles/var.less';

.type-container {
  .container-title {
    position: relative;
    white-space: nowrap;
    padding: 0 30px;
    height: 54px;
    font-size: 14px;
    color: #2d303b;

    &__text {
      font-size: 16px;
      line-height: 54px;
      font-weight: 500;
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 4px;
      height: 12px;
      background-color: #575962;
      top: 50%;
      transform: translate(0, -50%);
      left: 20px;
      border-radius: 3px;
    }
  }

  .type-detail {
    padding: 20px;
  }
}
</style>
