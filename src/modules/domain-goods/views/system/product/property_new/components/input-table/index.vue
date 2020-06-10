<template>
  <div class="input-table">
    <el-table
      :data="list"
      :span-method="arraySpanMethod"
      size="mini"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="listTitle" align="center" min-width="300px">
        <template slot-scope="{row}">
          <el-input
            v-model="row.value"
            :disabled="disabled"
            :clearable="true"
            class="edit-input"
            size="small"
            maxlength="32"
            placeholder="请输入"
            @input="updataValue"
          />
        </template>
      </el-table-column>

      <el-table-column :label="operateTitle" align="center" width="120">
        <template slot-scope="{row}">
          <el-button
            :class="{'el-alert--error': true, 'del-btn': true}"
            :disabled="disabled"
            type="text"
            @click="deleteItem(row, row.index)"
            >删除</el-button
          >
          <!-- 原型按钮方式，暂时保留 -->
          <!-- <el-button
            :class="{'el-alert--error': true, 'el-button-hidden': $index === 0}"
            :disabled="disabled"
            type="text"
            icon="el-icon-remove-outline"
            @click="deleteItem(row, row.index)"
          ></el-button>
          <el-button
            :disabled="disabled"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd($index)"
          ></el-button>-->
        </template>
      </el-table-column>
      <template slot="append">
        <div>
          <el-button
            type="text"
            style="width: 100%;"
            @click="handleAdd()"
            ><svg-icon icon-class="houtai-tianjia" /> 添加行</el-button
          >
        </div>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'InputTable',
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    listTitle: {
      type: String,
      default: '属性值',
    },
    operateTitle: {
      type: String,
      default: '操作',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: null,
    }
  },
  watch: {
    value(val) {
      // 如果跟当前选中值相同，则不更新
      this.$nextTick(() => {
        const componentValue = this.list
          .slice(0, -1)
          .map(info => info.value)
          .join(',')
        if (val && val.map(v => v.propertyValue).join(',') !== componentValue) {
          this.getList(val)
        }
      })
    },
  },
  created() {
    this.getList(this.value)
  },
  methods: {
    getList(value = []) {
      const newValue = value.slice(0)
      const list = newValue.map((info, rowIndex) => ({
        value: info.propertyValue,
        others: info,
        rowIndex,
      }))
      this.list = list
    },
    // 删除列表
    deleteItem(row) {
      const {rowIndex} = row
      this.list = this.list.filter(info => info.rowIndex !== rowIndex)
      // 更新删除值
      this.updataValue()
      this.$nextTick(() => {
        this.$emit('blur')
      })
    },
    // 合并指定单元格
    arraySpanMethod({row, column, rowIndex, columnIndex}) {
      if (row.type === 'button') {
        return [1, 2]
      }
    },
    // 添加列表项
    handleAdd(index) {
      let newList = this.list.map(info => info.others)
      const newItem = {propertyValue: ''}
      index ? newList.splice(index + 1, 0, newItem) : newList.push(newItem)
      this.getList(newList)
      this.$emit('input', newList)
    },
    // 修改的时候，更新value值
    updataValue() {
      const newList = this.list.map(info => {
        return {...info.others, propertyValue: info.value}
      })
      this.$emit('input', newList)
      this.$emit('change')
    },
  },
}
</script>
<style lang="less" scoped>
@--color-danger: #e24156;

.input-table {
  .el-button-hidden {
    visibility: hidden;
  }

  .el-alert--error {
    color: @--color-danger !important;
  }
}
</style>
<style lang="less">
tbody {
  .el-table__row:only-child {
    .del-btn {
      visibility: hidden !important;
    }
  }
}
</style>
