<template>
  <div v-loading="loading" class="list-select-container">
    <div class="box-card">
      <slot name="header">
        <div class="header">{{ title }}</div>
      </slot>
      <div class="input-container">
        <el-input v-model="filterText" placeholder="请输入内容" clearable>
          <!-- <i slot="prefix" class="el-input__icon el-icon-search"></i> -->
          <i slot="prefix" class="el-input__icon" style="width: 25px;display: inline-block;">
            <svg-icon icon-class="sousuo" />
          </i>
        </el-input>
      </div>
      <div class="content-container">
        <div v-if="list && list.length">
          <div
            v-for="(item, index) in list"
            :key="index"
            :class="{'content-item': true, active: value === item.id}"
            @click="handleItem(item)"
          >
            {{ item[props.label] }}
            <div class="icon-box">
              <i v-show="!(item.leaf || item.level === 2)" class="icon-caret-right"></i>
              <svg-icon
                v-show="item.id === value && (item.leaf || item.level === 2)"
                icon-class="anniu-queding"
              />
            </div>
          </div>
        </div>
        <div v-else class="panel-empty">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: null,
    },
    options: {
      type: Array,
      default() {
        return []
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default() {
        return {
          label: 'name',
          value: 'value',
          id: 'id',
          children: 'children',
        }
      },
    },
    title: {
      type: String,
      default: '第一级',
    },
  },
  //   components: {
  //     Scrollbar
  //   },
  data() {
    return {
      filterText: '',
      list: [], // 搜索列表
      //   selectId: null,
      activeItem: null,
    }
  },
  watch: {
    filterText(val) {
      this.$nextTick(() => {
        this.filterData(this.filterText)
      })
    },
    options: {
      immediate: true,
      handler(val) {
        // this.clearValue()
        this.list = val
      },
    },
    activeItem(item) {
      if (!item) {
        return
      } else {
        if (item.id === this.value && (item.leaf || item.level === 2)) {
          this.$emit('success', item.id, item)
          return
        }
        this.$emit('change')
      }
    },
    value(v, ov) {
      if (v !== ov) {
        this.activeItem = null
      }
    },
  },
  methods: {
    // 数据过滤
    filterData(val) {
      this.list = this.options.filter(
        info => info[this.props.label].indexOf(val) !== -1,
      )
    },
    // 选中当前的值
    handleItem(item) {
      //   this.selectId = item.id
      this.activeItem = item
      this.$emit('select', item)
      this.$emit('input', item[this.props.id])
    },
    // clearValue() {
    //   //   this.selectId = null
    //   this.activeItem = null
    //   this.$emit('input', '')
    //   this.$emit('select', {})
    // },
  },
}
</script>

<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.list-select-container {
  height: 360px;
  box-sizing: border-box;
  padding: 18px 20px;
  border: 1px solid #e4e8f3;

  .box-card {
    height: 100%;
  }

  .header {
    margin-bottom: 20px;
    color: #2d303b;
    font-weight: 500;
  }

  .input-container {
    padding-bottom: 10px;
  }

  .content-container {
    overflow: auto;
    height: calc(100% - 70px);
    margin: 0 -20px;
    overflow-x: hidden;

    .icon-box {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 14px;
      height: 14px;
      margin-right: -4px;

      .icon-caret-right {
        border: 4px solid transparent;
        border-left-color: #818389;
      }
    }

    .content-item {
      padding: 10px 40px;
      margin: 0 -20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;

      &.active {
        background: #f5f7fa;
        color: #2878ff;

        .icon-caret-right {
          border-left-color: #2878ff;
        }
      }
    }

    .panel-empty {
      margin: 0;
      height: 30px;
      line-height: 30px;
      padding: 20px 15px 0;
      color: @--color-text-secondary;
      text-align: center;
    }
  }
}
</style>
