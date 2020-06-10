<template>
  <div
    :style="{width: width, borderRadius: type === 'view' ? '10px' : ''}"
    class="panel"
  >
    <div :class="`panel-${panelType}__header`">
      <div :class="`panel-${panelType}__title`">
        <h3 class="title">{{ title }}</h3>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div :class="`panel-${panelType}__operation`">
        <slot name="operation"></slot>
      </div>
    </div>
    <div :style="{padding: bodyPadding}" class="panel__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  props: {
    // 标题
    title: {
      type: String,
      default: '',
    },
    // 小标题
    subtitle: {
      type: String,
      default: '',
    },
    // 展示类型
    type: {
      type: String,
      default: 'view',
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['view', 'edit'].indexOf(value) !== -1
          ? true
          : console.error('type is view or edit')
      },
    },
    // body设置padding
    bodyPadding: {
      type: String,
      default: '20px',
    },
    // panel宽度
    width: {
      type: String,
      default: '100%',
    },
  },
  computed: {
    // panel类型
    panelType() {
      return ['view', 'edit'].indexOf(this.type) !== -1 ? this.type : 'view'
    },
  },
}
</script>

<style lang="less">
.panel {
  background-color: #fff;

  &-view {
    &__header {
      display: flex;
      justify-content: space-between;
      height: 54px;
      line-height: 54px;
      padding: 0 20px;
    }

    &__title {
      display: flex;
    }
  }

  &-edit {
    &__header {
      display: flex;
      justify-content: space-between;
      height: 54px;
      line-height: 54px;
      padding: 0 20px;
    }

    &__title {
      display: flex;
      position: relative;
      padding-left: 10px;

      &::before {
        content: '';
        display: block;
        width: 4px;
        height: 12px;
        background-color: #575962;
        border-radius: 4px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  &-view__title,
  &-edit__title {
    .title {
      font-size: 14px;
      color: #2d303b;
      font-weight: 500;
    }

    .subtitle {
      font-size: 12px;
      color: #9ca6c7;
      padding-left: 10px;
    }
  }

  &-view__title {
    .title {
      font-size: 16px;
    }
  }
}
</style>
