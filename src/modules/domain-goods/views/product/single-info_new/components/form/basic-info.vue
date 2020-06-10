<!-- 基本信息 -->
<template>
  <div class="basic-info-container">
    <type-container title="基本信息">
      <el-form ref="categoryForm" :model="categoryForm" :rules="rules" label-width="120px">
        <el-form-item label="商品类目" prop="categoryName">
          <el-input
            ref="selectCategory"
            v-model="categoryForm.categoryName"
            class="form-item"
            placeholder="选择类目"
            @click.native="$emit('select-category-click')"
            @focus="$refs.selectCategory.blur()"
          >
            <el-button slot="suffix" type="text">选择所属类目</el-button>
          </el-input>
        </el-form-item>
      </el-form>

      <el-form-renderer
        ref="topForm"
        :content="nameContent"
        :disabled="disabled"
        label-width="120px"
        v-show="!disabled"
      ></el-form-renderer>
      <div class="item-info" v-show="!disabled">在商品详情页标题下面展示卖点信息，建议60字以内</div>

      <div v-if="propertyList" v-show="!disabled">
        <el-form ref="propertyForm" :model="propertyForm" :rules="rules" label-width="120px">
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
              class="form-item"
              placeholder="请选择"
              :clearable="true"
              v-model="propertyForm[item.propertyId]"
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
              v-model="propertyForm[item.propertyId]"
              class="form-item"
              :clearable="true"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>
    </type-container>
  </div>
</template>

<script>
import TypeContainer from './type-container'
import {codePattern, chineseNamePattern} from '^domain-goods/const/pattern'

export default {
  name: 'BasicInfo',
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
    brandList: {
      type: Array,
      default() {
        return []
      },
    },
    categoryName: {
      type: [String],
      default: '',
    },
  },
  data() {
    return {
      propertyForm: {},
      propertiesItemForm: {},
      itemProperty: [],
      categoryForm: {
        categoryName: '',
      },
      rules: {
        categoryName: [
          {required: true, message: '请选择商品类目', trigger: 'blur'},
        ],
      },
      nameContent: [
        {
          $id: 'code',
          $type: 'input',
          label: '商品编码',
          $el: {
            class: 'form-item',
            placeholder: '请输入',
            // maxlength: 32,
            // clearable:true,
          },
          rules: [
            {
              required: true,
              message: '请输入商品编码',
              trigger: ['blur', 'change'],
            },
            {
              pattern: codePattern,
              message: '编码不能带有中文',
              trigger: ['blur', 'change'],
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'name',
          $type: 'input',
          label: '商品名称',
          $el: {
            class: 'form-item',
            placeholder: '请输入',
            // maxlength: 32,
            // clearable:true,
          },
          rules: [
            {
              required: true,
              message: '请输入商品名称',
              trigger: ['blur', 'change'],
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
        // 品牌列表选取
        {
          $id: 'brandId',
          $type: 'select',
          label: '商品品牌',
          $el: {
            class: 'form-item',
            placeholder: '请选择',
            // clearable:true,
          },
          options: [],
          rules: [
            {
              required: true,
              message: '请选择商品品牌',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'subName',
          $type: 'input',
          label: '副标题',
          $el: {
            type: 'textarea',
            // maxlength: 150,
            class: 'form-item',
            placeholder: '请输入',
          },
          rules: [
            {
              min: 0,
              max: 150,
              message: '最长不得超过150个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
      ],
      defaultProps: {
        key: 'propertyName',
        value: 'propertyValue',
      },
      list: null,
      newList: null, // 商品属性信息
    }
  },
  watch: {
    categoryName: {
      immediate: true,
      handler(val) {
        this.categoryForm.categoryName = val
      },
    },
    brandList: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.topForm.setOptions('brandId', val)
        })
      },
    },
    propertyList(val) {
      if (val) {
        const newVal = val.map(v => {
          return {
            ...v.property,
            propertyId: v.propertyId,
            propertyType: v.propertyTypes,
            required: v.required,
          }
        })
        // list是展示的数据
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
    validateCategory() {
      const $categoryForm = this.$refs.categoryForm
      const categoryValidate = $categoryForm.validate(valid => {
        if (!valid) {
          this.$emit('category is required')
        }
      })
    },
    // 设置form的值
    setFormValue(params) {
      const {code, name, subName, brandId, itemProperty} = params
      this.$refs.topForm.updateForm({
        code,
        name,
        subName,
        brandId,
      })
      // 获取原来的属性数组，去重，优先保存修改前的数据
      let newList = []
      this.itemProperty = itemProperty
      itemProperty &&
        itemProperty.forEach(info => {
          const {itemPropertyValue = []} = info
          const propertyValue = itemPropertyValue
            .map(v => {
              this.$set(this.propertyForm, `${info.propertyId}_id`, v.id)
              return v.propertyValue
            })
            .join('')
          newList.push({
            ...info,
            propertyValue,
          })
          if (info.propertyId) {
            this.$set(this.propertyForm, info.propertyId, propertyValue)
            this.$set(this.propertiesItemForm, info.propertyId, info)
          }
        })
      this.newList = newList
    },
    // 去除form的值
    async getFormValue() {
      const $topForm = this.$refs.topForm
      const $categoryForm = this.$refs.categoryForm
      const $propertyForm = this.$refs['propertyForm']
      try {
        // const validatePropertyRes = this.validateProperty()
        const categoryValidate = await $categoryForm.validate()
        const valiTopForm = await $topForm.validate()
        const validatePropertyRes = await $propertyForm.validate()
        if (valiTopForm && categoryValidate && validatePropertyRes) {
          // 将返回form表单的值
          const {code, name, subName, brandId} = $topForm.getFormValue()
          const bottomFormValue = this.list
          // 返回的属性数组
          let goodsPropertyValue = []

          bottomFormValue &&
            bottomFormValue.forEach((info, index) => {
              if (this.propertiesItemForm[info.propertyId]) {
                const item = {
                  ...this.propertiesItemForm[info.propertyId],
                }
                const {itemPropertyValue = []} = item
                itemPropertyValue[0] &&
                  (itemPropertyValue[0].propertyValue = this.propertyForm[
                    info.propertyId
                  ])

                goodsPropertyValue.push(item)
                return
              }

              delete info.createdTime
              delete info.updatedTime
              delete info.propertyValue
              delete info.id
              // List

              // 属性值数组
              let itemPropertyValue = []
              const propertyValueItem =
                info.propertyValueList.find(
                  v => v.propertyValue === this.propertyForm[info.propertyId],
                ) || {}
              delete propertyValueItem.id
              if (this.propertyForm[`${info.propertyId}_id`]) {
                propertyValueItem.id = this.propertyForm[
                  `${info.propertyId}_id`
                ]
              }
              itemPropertyValue.push(
                Object.assign(
                  {
                    propertyValue: this.propertyForm[info.propertyId],
                  },
                  propertyValueItem,
                ),
              )

              goodsPropertyValue.push({
                ...info,
                itemPropertyValue,
              })
            })
          return {
            code,
            name,
            subName,
            brandId,
            goodsPropertyValue,
          }
        } else {
          this.$notify.error('请填写完整的基本信息')
          return null
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 重置form表单的值
    resetFormValue() {
      this.$refs.topForm.resetFields()
      this.$refs.categoryForm.resetFields()
      for (const item in this.propertyForm) {
        this.propertyForm[item] = ''
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.basic-info-container {
  .item-info {
    margin-left: 120px;
    margin-top: -20px;
    margin-bottom: 24px;
    padding: 10px 0 0 10px;
    font-size: 12px;
    color: @--color-text-secondary;
  }
}
</style>
<style lang="less">
.basic-info-container {
  .form-item {
    width: 35%;
    min-width: 200px;
    max-width: 800px;
  }
  textarea{
    width: 100%;
  }
}
</style>
