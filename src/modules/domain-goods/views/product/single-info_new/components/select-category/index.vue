<template>
  <div class="select-category-container">
    <div class="summary">
      当前已选择
      <span class="select-show">{{ nameList.filter(v => v && v.length > 0).join('，') }}</span>
    </div>
    <el-row v-loading="categoryLoading" :gutter="30" type="flex" justify="center">
      <el-col :span="8">
        <select-box
          v-model="idForm['first']"
          :options="firstOptions"
          title="一级商品类目"
          @select="selectFirstItem"
          @success="sendTarget"
          @change="clearValue"
        ></select-box>
      </el-col>
      <el-col :span="8">
        <select-box
          v-model="idForm['second']"
          :options="secondOptions"
          title="二级商品类目"
          @select="selectSecondItem"
          @success="sendTarget"
          @change="clearValue"
        ></select-box>
      </el-col>
      <el-col :span="8">
        <select-box
          v-model="idForm['third']"
          :options="thirdOptions"
          title="三级商品类目"
          @select="selectThirdItem"
          @success="sendTarget"
          @change="clearValue"
        ></select-box>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import selectBox from './components/select-box'

export default {
  components: {
    selectBox,
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    value: {
      //   type: [Number, String],
      type: Array,
      default() {
        return []
      },
    },
    dialogVisible: {
      // 判断弹窗关闭
      type: Boolean,
      default: false,
    },
    defaultItem: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      categoryLoading: false,
      idForm: {
        first: null,
        second: null,
        third: null,
      },
    }
  },
  computed: {
    firstOptions() {
      return this.data.map(v => {
        return {
          ...v,
        }
      })
    },
    secondOptions() {
      if (!this.idForm['first']) return []
      return (
        (this.data.find(v => v.id === this.idForm['first']) &&
          this.data.find(v => v.id === this.idForm['first']).children) ||
        []
      )
    },
    thirdOptions() {
      if (!this.idForm['second']) return []
      return (
        (this.secondOptions.find(v => v.id === this.idForm['second']) &&
          this.secondOptions.find(v => v.id === this.idForm['second'])
            .children) ||
        []
      )
    },
    firstItem() {
      return (
        (this.firstOptions &&
          this.idForm['first'] &&
          this.firstOptions.find(item => item.id === this.idForm['first'])) ||
        null
      )
    },
    secondItem() {
      return (
        (this.secondOptions &&
          this.idForm['second'] &&
          this.secondOptions.find(item => item.id === this.idForm['second'])) ||
        null
      )
    },
    thirdItem() {
      return (
        (this.thirdOptions &&
          this.idForm['third'] &&
          this.thirdOptions.find(item => item.id === this.idForm['third'])) ||
        null
      )
    },
    nameList() {
      return [
        (this.firstItem && this.firstItem.name) || '',
        (this.secondItem && this.secondItem.name) || '',
        (this.thirdItem && this.thirdItem.name) || '',
      ]
    },
    idList() {
      return [
        (this.firstItem && this.firstItem.id) || null,
        (this.secondItem && this.secondItem.id) || null,
        (this.thirdItem && this.thirdItem.id) || null,
      ].filter(id => id)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.idForm['first'] = this.value[0] || null
        this.idForm['second'] = this.value[1] || null
        this.idForm['third'] = this.value[2] || null
      },
    },
    dialogVisible() {
      // 取消恢复选中
      this.setDefaultValue()
    },
  },
  created() {
    // 有初始化数据时
    this.setDefaultValue()
  },
  methods: {
    selectFirstItem(payload) {
      //   console.log(payload);
      //   this.valueForm['first'] = payload.name
      //   this.valueArr[0] = payload.name
      //   this.idArr[0] = payload.id
      //   this.idForm['first'] = payload.id
    },
    selectSecondItem(payload) {
      //   console.log(payload);
      //   this.valueForm['second'] = payload.name
      //   this.valueArr[1] = payload.name
      //   this.idArr[1] = payload.id
      //   this.idForm['second'] = payload.id
    },
    selectThirdItem(payload) {
      //   console.log(payload);
      //   this.valueForm['third'] = payload.name
      //   this.valueArr[2] = payload.name
      //   this.idArr[2] = payload.id
      //   this.idForm['third'] = payload.id
    },
    sendTarget(id) {
      // 选中success值时
      this.$emit('input', this.idList)
      this.$emit('select', this.nameList)
    },
    clearValue() {
      this.$emit('input', this.idList)
      this.$emit('change')
    },
    setDefaultValue() {
      // 通过类目对象设置默认选择值
      if (this.defaultItem) {
        const {path} = this.defaultItem
        if (path) {
          const list = path.split('/')
          this.idForm['first'] = Number(list[0]) || null
          this.idForm['second'] = Number(list[1]) || null
          this.idForm['third'] = Number(list[2]) || null
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.select-category-container {
  .summary {
    padding-bottom: 20px;

    .select-show {
      color: #2878ff;
    }
  }
}
</style>
