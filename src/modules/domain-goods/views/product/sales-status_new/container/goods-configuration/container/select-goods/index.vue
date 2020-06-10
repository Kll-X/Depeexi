<template>
  <div class="select-goods">
    <!-- <el-button-group>
      <el-button type="primary">标准商品</el-button>
      <el-button type="primary">组合商品</el-button>
    </el-button-group>-->
    <div class="total-text">
      当前已选择
      <span class="total-text-color">{{ selectedNumber }}</span>
      项
    </div>
    <el-data-table
      ref="dataTable"
      v-bind="tableConfig"
      @update="dataFormatter"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import {getSkuItem_String} from '^domain-goods/services/commodity-center.js'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      selected: [],
      tableConfig: {
        url: getSkuItem_String,
        hasDialog: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        hasOperation: false,
        persistSelection: true,
        id: 'skuId',
        saveQuery: false,
        columns: [
          {type: 'selection'},
          {
            prop: 'systemGoodCode',
            label: '商品编码',
             minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'systemGoodName',
            label: '商品名称',
             minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'systemGoodSKU',
            label: '商品SKU编码',
             minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'price',
            label: '价格',
             minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
        // searchForm: [
        //   {
        //     $type: 'input',
        //     $id: 'name',
        //     label: '',
        //     $el: {
        //       placeholder: '渠道、商品编码、商品名称',
        //       clearable: true,
        //       'prefix-icon': 'el-icon-search',
        //     },
        //   },
        // ],
      },
      // selected: [],
    }
  },
  computed: {
    selectedNumber() {
      return (this.selected && this.selected.length) || 0
    },
  },
  watch: {
    dialogVisible(val, oval) {
      if (val === true && val !== oval) {
        this.$refs.dataTable && this.$refs.dataTable.getList()
      }
    },
  },
  methods: {
    onSelectionChange(val) {
      this.selected = [...val]
    },
    dataFormatter(val) {
      const newData = val.map(item => {
        return {
          // ...item, // 整个sku
          systemGoodName: item.itemWhole && item.itemWhole.name,
          systemGoodCode: item.itemWhole && item.itemWhole.code,
          systemGoodSKU: item.sku && item.sku.code,
          price: item.sku && item.sku.price,
          skuId: item.sku && item.sku.id,
          itemId: item.itemWhole && item.itemWhole.id,
          shopCode: '10086', // 暂时写死
        }
      })
      this.$refs.dataTable && (this.$refs.dataTable.data = newData)
    },
    clearSelection() {
      // 重置选中
      this.$refs.dataTable && this.$refs.dataTable.clearSelection()
    },
    setSelected(data) {
      if (this.$refs.dataTable) {
        this.$set(this.$refs.dataTable, 'selected', [...data])
        // console.log(this.$refs.dataTable)
      }
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.select-goods {
  .total-text {
    font-size: 12px;
    line-height:17px;
    margin-bottom: 10px;
    &-color {
      color: @color__success;
    }
  }
}
</style>
