<script>
export default {
  name: 'StateTag',
  props: {
    type: {
      type: String,
      default: 'primary',
    },
    size: {
      type: String,
      default: '',
    },
  },
  render() {
    const TYPE = this.type || 'primary'
    const SIZE = this.size || this.$ELEMENT.size
    const classes = [
      'state-tag',
      TYPE && `state-tag--${TYPE}`,
      SIZE && `state-tag--${SIZE}`,
    ]

    const tagEl = <span class={classes}>{this.$slots.default}</span>
    return tagEl
  },
}
</script>

<style lang="less">
@--color-primary: #5d81f9;
@--color-success: #02c5e2;
@--color-warning: #f5a623;
@--color-danger: #e24156;
@--color-info: #abacb1;

@stateList: primary, success, warning, danger, info;
@stateColor: @--color-primary, @--color-success, @--color-warning,
  @--color-danger, @--color-info;

// 循环样式
.backgroundColor(@index) {
  @curName: extract(@stateList, @index);

  &.state-tag--@{curName} {
    &::before {
      background-color: extract(@stateColor, @index);
    }
  }
}
.loop(@i) when (@i <= length(@stateList)) {
  .backgroundColor(@i);
  .loop(@i+1);
}

.state-tag {
  padding-left: 10px;
  font-size: 14px;
  position: relative;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    background-color: @--color-primary;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .loop(1);

  &--medium {
    font-size: 14px;
  }

  &--small {
    font-size: 12px;
  }

  &--mini {
    font-size: 10px;
  }
}
</style>
