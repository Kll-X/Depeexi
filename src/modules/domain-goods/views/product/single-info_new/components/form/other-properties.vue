<!-- 基本信息 -->
<template>
  <div class="other-properties-container">
    <type-container title="商品其他属性">
      <el-form ref="propertyForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item
          v-for="(item, index) in list"
          :key="index"
          :label="item.propertyName"
          :required="item.required"
          :prop="item.propertyId.toString()"
        >
          <el-select
            v-if="item.inputType == '1'"
            :disabled="disabled"
            v-model="ruleForm[item.propertyId]"
            style="width:35%"
            placeholder="请选择"
          >
            <el-option
              v-for="(inner, index) in item.propertyValueList"
              :key="index"
              :label="inner.value"
              :value="inner.value"
            ></el-option>
          </el-select>
          <el-input
            v-else
            :disabled="disabled"
            v-model="ruleForm[item.propertyId]"
            :clearable="true"
            style="width:35%"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </type-container>
  </div>
</template>

<script>
import TypeContainer from './type-container'
export default {
  name: 'OtherProperties',
  components: {
    TypeContainer,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    propertyList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      rules: {},
      ruleForm: {},
      propertiesItemForm: {},
      itemProperty: [], // 属性值列表
      list: null,
      newList: null, // 商品属性信息
    }
  },
  watch: {
    propertyList(val) {
      if (val) {
        const newVal = val.map(v => {
          return {
            ...v.property,
            propertyType: v.propertyTypes,
            propertyId: v.propertyId,
            required: v.required,
          }
        })

        this.list = newVal.reduce((arr, info) => {
          let propertyValueList = info.propertyValue || []
          propertyValueList = propertyValueList.map(item => {
            delete item.createdTime
            delete item.updatedTime
            return {
              ...item,
              value: item.propertyValue,
              key: item.id,
            }
          })
          // 动态设置校验规则
          let itemRule = [
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ]
          info.required &&
            itemRule.unshift({
              message: `请${info.propertyType === 1 ? '输入' : '选择'}${
                info.propertyName
              }`,
              required: true,
              trigger: ['blur', 'change'],
              // whitespace:true
            })
          this.$set(this.rules, info.propertyId, itemRule)
          arr.push({
            ...info,
            propertyValueList,
          })
          return arr
        }, [])
      } else {
        this.list = null
      }
    },
  },
  methods: {
    // 去除form的值
    async getFormValue() {
      const validatePropertyRes = await this.$refs['propertyForm'].validate()
      if (!validatePropertyRes) return
      const form = this.list
      const formValue =
        form &&
        form.map(info => {
          // 属性值数组
          let itemPropertyValue = []
          const propertyValueItem =
            info.propertyValueList.find(
              v => v.id === this.ruleForm[info.propertyId],
            ) || {}
          itemPropertyValue.push(
            Object.assign(
              {
                propertyValue: this.ruleForm[info.propertyId],
              },
              propertyValueItem,
            ),
          )
          // let itemPropertyValue = []
          // itemPropertyValue.push({
          //   propertyValue: this.ruleForm[info.propertyId],
          // })
          let item = {
            ...info,
            itemPropertyValue,
          }

          delete item.propertyValueList
          delete item.createdTime
          delete item.updatedTime
          delete item.id

          if (this.propertiesItemForm[info.propertyId]) {
            item = {
              ...this.propertiesItemForm[info.propertyId],
            }
            const {itemPropertyValue = []} = item
            itemPropertyValue[0] &&
              (itemPropertyValue[0].propertyValue = this.ruleForm[
                info.propertyId
              ])
          }
          return item
        })
      return formValue
    },

    setFormValue(itemProperty) {
      this.itemProperty = itemProperty
      itemProperty &&
        itemProperty.forEach(info => {
          const {itemPropertyValue = []} = info
          const propertyValue = itemPropertyValue.map(v => v.propertyValue)[0]

          if (info.propertyId) {
            this.$set(this.ruleForm, info.propertyId, propertyValue)
            this.$set(this.propertiesItemForm, info.propertyId, info)
          }
        })
    },
    // 重置值
    resetFormValue() {
      // this.list.forEach(info => (info.propertyValue = ''))
      for (const item in this.ruleForm) {
        this.ruleForm[item] = ''
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.form-item {
  width: 100%;
}
</style>
