<template>
  <div class="form-card">
    <div class="form-card__header">
      <span class="title__text">{{ title }}</span>
    </div>
    <div class="form-card__body">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    title: {
      type: String,
      default: '基本信息',
    },
    defaultProps: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    labelName() {
      return this.defaultProps.lebel || 'label'
    },
    valueName() {
      return this.defaultProps.value || 'value'
    },
    keyName() {
      return this.defaultProps.key || 'id'
    },
  },
}
</script>
<style lang="less" scoped>
.form-card {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  line-height: 20px;
  color: #2d303b;
  font-weight: 400;

  &__header {
    padding: 20px 30px;
    font-weight: 500;
    position: relative;

    .title__text {
      display: flex;
      align-items: center;
      font-size: 16px;

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
  }

  &__body {
    padding: 20px 35px;
    // display: flex;
    // justify-content: center;
  }
}
</style>
