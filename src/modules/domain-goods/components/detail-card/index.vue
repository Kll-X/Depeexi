<template>
  <div class="detail-card">
    <div class="card__header">{{ title }}</div>
    <div :class="{is_vertical: vertical}" class="card__body">
      <slot name="default">
        <template v-for="(item, index) in data">
          <div :key="index" class="card-item">
            <div class="card-item__label">
              {{
              item.labelFormatter
              ? item.labelFormatter(item, index)
              : item[labelName]
              }}
            </div>
            <div class="card-item__Separated">{{ Separated }}</div>

            <div class="card-item__value">
              <slot :name="item[keyName]" v-bind="item">
                {{
                item.formatter ? item.formatter(item, index) : item[valueName]
                }}
              </slot>
            </div>
          </div>
        </template>
      </slot>
      <slot name="append"></slot>
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
    Separated: {
      type: String,
      default: ':',
    },
    vertical: {
      type: Boolean,
      default: false,
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
.detail-card {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  font-size: 14px;
  line-height: 20px;
  color: #2d303b;
  font-weight: 400;

  .card__header {
    padding: 20px 20px 10px;
    // border-bottom: 1px solid #e4e8f3;
    font-size: 16px;
    font-weight: 500;
  }

  .card__body {
    padding: 0 20px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    &.is_vertical {
      flex-direction: column;
      display: block;
    }

    .card-item {
      flex-basis: 33%;
      padding: 10px 0;
      display: flex;

      &__label {
        white-space: nowrap;
        color: #818389;
        font-size: 14px;
      }

      .card-item__Separated {
        flex: 0 0 auto;
        min-width: 10px;
        color: #818389;
      }

      .card-item__value {
        color: #2d303b;
      }
    }
  }
}
</style>
