<template>
  <el-autocomplete
    v-model="inputValue"
    :fetch-suggestions="querySearchAsync"
    :clearable="true"
    placeholder="请输入内容"
    value-key="name"
    popper-class="getScroll"
    @select="handleSelect"
  >
    <i
      slot="prefix"
      class="el-input__icon"
      style="width: 25px; display: inline-block;"
    >
      <svg-icon icon-class="sousuo" />
    </i>
  </el-autocomplete>
</template>
<script>
import {Autocomplete} from 'element-ui'
import {getFrontCategorys} from '^domain-goods/services/commodity-center.js'

// const getFrontCategorys = getBackCategorys
const typeCode = 0 // typeCode{1:后台,0:前台}

export default {
  components: {
    ElAutocomplete: Autocomplete,
  },
  data() {
    return {
      inputValue: '',
      list_all: [],
    }
  },
  watch: {
    inputValue(val) {
      if (val === null || val === '') {
        // 清空输入触发事件
        this.$emit('emptyInput')
      }
    },
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      const list = await this.getSelectList({name: queryString, typeCode})
      cb(list)
    },
    handleSelect(item) {
      this.$emit('select', item)
    },
    // 请求选择列表
    async getSelectList(parmas) {
      const res = await getFrontCategorys(parmas)
      const {payload} = res
      if (payload) {
        this.list_all = payload // 保存取下来的数据
        return payload
      } else {
        return []
      }
    },
  },
}
</script>
<style lang="less">
.getScroll .el-autocomplete-suggestion__wrap.el-scrollbar__wrap {
  overflow-x: scroll;
}
</style>
