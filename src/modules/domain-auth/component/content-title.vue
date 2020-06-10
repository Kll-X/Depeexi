<template>
  <p class="content-title">
    <span class="title">{{ title }}</span>
    <slot></slot>
  </p>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="less">
.content-title {
  padding: 12px 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .title {
    margin-left: 11px;
    font-size: 16px;
    font-weight: 500;
    color: #2d303b;
    line-height: 22px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 4px;
    height: 12px;
    background: rgba(87, 89, 98, 1);
    border-radius: 3px;
  }
}
</style>
