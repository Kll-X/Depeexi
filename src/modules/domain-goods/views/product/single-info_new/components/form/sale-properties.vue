<template>
  <div class="sale-properties-container">
    <type-container title="商品销售属性">
      <el-form :rules="rules" :model="$data" ref="form" label-width="0">
        <el-table
          row-key="rowKey"
          :data="tableData"
          style="min-width: 400px;width:max-content;max-width:100%;"
        >
          <template v-for="(item) in list">
            <el-table-column
              :label="item.required ? '*' + item.label : item.label"
              :min-width="item.width || defaultOptions.width || 200"
              :key="item.key"
            >
              <template slot="default" slot-scope="scope">
                <!-- 动态设置prop， 注意绑定rules -->
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.' +item.key.toString()"
                  :rules="rules[item.key]"
                >
                  <el-select
                    v-if="item.inputType == '1'"
                    :disabled="disabled"
                    v-model="scope.row[item.key]"
                    :clearable="true"
                    placeholder="请选择"
                    class="form-item"
                    style="width:100%"
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
                    v-model="scope.row[item.key]"
                    placeholder="请输入"
                    :clearable="true"
                    style="width:100%"
                    class="form-item"
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-if="!disabled" label="操作" width="120">
            <template slot="default" slot-scope="scope">
              <el-button
                class="del-btn"
                type="text"
                style="color: #f56c6c;"
                @click="deleteEmptyItem(scope.$index)"
              >删除</el-button>
              <!-- v-show="scope.$index !== 0" -->
              <!-- <el-button
              type="text"
              :class="{'el-icon-remove-outline':true}"
              style="color: #f56c6c;"
              @click="deleteEmptyItem(scope.$index)"
              ></el-button>-->
              <!-- <el-button
              type="text"
              class="el-icon-circle-plus-outline"
              @click="addRow(scope.$index )"
              ></el-button>-->
            </template>
          </el-table-column>
          <template v-if="!disabled" slot="append">
            <div>
              <el-button type="text" style="width: 100%;" @click="addRow()">
                <svg-icon icon-class="houtai-tianjia" />添加行
              </el-button>
            </div>
          </template>
        </el-table>
      </el-form>
    </type-container>
  </div>
</template>

<script>
import TypeContainer from './type-container'
import AutocompleteInput from '^domain-goods/components/autocomplete-input/index.vue'
import {codePattern, pricePattern} from '^domain-goods/const/pattern'

export default {
  name: 'SaleProperties',
  components: {
    TypeContainer,
    AutocompleteInput,
  },
  props: {
    propertyList: {
      type: Array,
      default() {
        return []
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultOptions: {
      type: Object,
      default() {
        return {
          width: 180,
        }
      },
    },
  },
  data() {
    return {
      tableData: [],
      list: null,
      propertiesList: [],
      defaultList: [
        {label: 'SKU编码', key: 'code', required: true},
        {label: '价格', key: 'price', required: true},
      ],
      rules: {
        code: [
          {
            required: true,
            message: '请输入SKU编码',
            trigger: ['blur', 'change'],
          },
          {
            min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
          {
            pattern: codePattern,
            message: '编码不能带有中文',
            trigger: ['blur', 'change'],
          },
        ],
        price: [
          {required: true, message: '请输入价格', trigger: ['blur', 'change']},
          {
            min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
          {
            pattern: codePattern,
            message: '价格必须是数字',
            trigger: ['blur', 'change'],
          },
        ],
      },
      initData: [],
      initNewData: [],
      emptyItem: function() {},
    }
  },
  watch: {
    propertyList: {
      immediate: false,
      handler(val) {
        if (val) {
          const newVal = val.map(v => {
            return {
              ...v.property,
              propertyType: v.propertyTypes, // 属性类型
              propertyId: v.propertyId, // 属性id
              required: v.required, // 判断属性是否必填
            }
          })
          const propertiesList = newVal.reduce((arr, info) => {
            let propertyValueList = info.propertyValue || []
            const propertyValue = ''
            propertyValueList = propertyValueList.map(item => {
              return {
                value: item.propertyValue,
                key: item.id, // propertyValueId
              }
            })
            arr.push({
              ...info,
              propertyValue,
              propertyValueList,
              key: info.id, //  propertyid
              label: info.propertyName,
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
            return arr
          }, [])
          this.propertiesList = propertiesList
          this.list = [...this.defaultList, ...propertiesList]
        } else {
          this.list = [...this.defaultList]
        }
        const _this = this
        this.emptyItem = function() {
          if (!_this.list) return
          for (const item of _this.list) {
            this[item.key] = ''
          }
          this['rowKey'] = new Date().valueOf() // 数据行关键字，新增时随机生成
        }
        if (this.tableData && this.tableData.length === 0) {
          // 只在无数据时填充默认数据项
          this.tableData.push(new this.emptyItem())
        }
      },
    },
  },
  methods: {
    // 设置value
    setFormValue(data) {
      const newData = data.map(item => {
        const {skuPropertyValue, ...info} = item
        const skuPropValues =
          skuPropertyValue &&
          skuPropertyValue.reduce((obj, v) => {
            obj[v['propertyId']] = v['propertyValue']
            return obj
          }, {})
        return {
          ...info,
          ...skuPropValues,
          rowKey: info.id, // 数据行关键字
          skuPropertyValue,
          price: info.price && info.price.toString(),
        }
      })
      this.initData = JSON.parse(JSON.stringify(newData))
      this.tableData = newData
    },
    // 获取当前的dataTable值
    async getFormValue() {
      // 校验
      const $propertyForm = this.$refs.form
      const validatePropertyRes = await $propertyForm.validate()
      if (!validatePropertyRes) {
        return
      }
      // 校验通过
      const dataList = this.tableData
      let del = []
      let add = []
      let updated = []
      this.initData.forEach(item => {
        !dataList.map(v => v.id).includes(item.id) && del.push(item)
      })

      const relatedPropertiesIdList = this.propertiesList.map(item => {
        return item.propertyId
      })
      const tableData = dataList.map(item => {
        // 判断是更新数据还是新增数据
        // 默认新增
        item.skuPropertyValue =
          (item.skuPropertyValue &&
            item.skuPropertyValue.filter(item => {
              return relatedPropertiesIdList.includes(item.propertyId)
            })) ||
          []
        let skuPropertyValue = this.propertiesList.map(v => {
          const info = {
            propertyId: v.propertyId,
            propertyName: v.propertyName,
            propertyCode: v.propertyCode,
            propertyValue: item[v.propertyId] || '',
          }
          const propertyValueItem = v.propertyValueList.find(
            k => k.value === info.propertyValue,
          )
          if (propertyValueItem) {
            info.propertyValueId = propertyValueItem.key
          }
          return info
        })
        // 更新数据时
        if (item.skuPropertyValue) {
          let existSkuPropertyValueObj = {}
          item.skuPropertyValue.forEach(j => {
            existSkuPropertyValueObj[j.propertyId] = j
          })

          skuPropertyValue = skuPropertyValue.map(k => {
            const data = existSkuPropertyValueObj[k.propertyId] || {}
            return {
              ...data,
              ...k,
            }
          })
        }
        const info = {
          code: item.code,
          price: item.price,
          skuPropertyValue: skuPropertyValue || [],
          // id: item.id,
        }
        if (item.id) info.id = item.id
        !this.initData.map(v => v.id).includes(item.id) && add.push(info)
        return info
      })
      updated = tableData.filter(item => item.id)
      // 属性更名,考虑到jsonStringfy会将num保存str,使用解构
      updated = updated.map(v => {
        // 修改属性
        let skuPropertyValueUpdate = []
        // 新增属性
        let skuPropertyValueAdd = []
        let skuPropertyValueDelete = []
        const skuPropertyValue = v.skuPropertyValue || []
        skuPropertyValue.forEach(item => {
          if (item.id) {
            skuPropertyValueUpdate.push(item)
            return
          }
          skuPropertyValueAdd.push(item)
        })
        const initDataItem = this.initData.find(item => {
          return item.id === v.id
        })
        const initDataItemIds =
          (initDataItem.skuPropertyValue &&
            initDataItem.skuPropertyValue.map(item => item.id)) ||
          []
        const skuPropertyValueUpdateIds = skuPropertyValueUpdate.map(
          item => item.id,
        )
        // initDataItemIds.forEach(item => {
        //   if (!skuPropertyValueUpdateIds.includes(item.id))
        //     skuPropertyValueDelete.push(item.id)
        // })
        skuPropertyValueDelete = initDataItemIds.filter(item => {
          return !skuPropertyValueUpdateIds.includes(item)
        })

        const item = {
          ...v,
          skuPropertyValueUpdate,
          skuPropertyValueAdd,
          skuPropertyValueDelete,
        }
        delete item.skuPropertyValue
        return item
      })
      del = del.map(v => v.id)
      add = add.map(v => {
        const item = {
          ...v,
          skuPropertyValueAdd: v.skuPropertyValue,
        }
        delete item.skuPropertyValue
        return item
      })
      return {tableData, del, add, updated} || []
    },
    // 重置当前的dataTable值
    resetFormValue() {
      this.tableData = []
    },
    //新增
    addRow(index) {
      const emptyItem = new this.emptyItem()
      index
        ? this.tableData.splice(index + 1, 0, emptyItem)
        : this.tableData.push(emptyItem)
    },
    // 移除某一项
    deleteEmptyItem(index) {
      this.tableData.splice(index, 1)
    },
  },
}
</script>
<style lang="less">
.sale-properties-container {
  tbody {
    .el-table__row:only-child {
      .del-btn {
        visibility: hidden;
      }
    }
  }
  .el-table__row {
    td {
      padding-bottom: 0px;
      & > div {
        padding-bottom: 18px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
