<template>
  <div class="goodList">
    <div class="goodList-tit">
      {{ status ? '商品明细' : '商品退货明细' }}
    </div>
    <div>
      <el-data-table
        ref="goodTable"
        v-bind="goodListConfig"
        :columns="goodListCloumns"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodList',
  props: {
    goodList: {
      type: Array,
      default: () => [],
    },
  },
  inject: ['status'],
  data() {
    return {
      goodListConfig: {
        hasEdit: false,
        hasDelete: false,
        hasOperation: false,
        hasPagination: false,
        hasView: false,
        hasNew: false,
      },
    }
  },
  computed: {
    goodListCloumns() {
      const baseCloumn = [
        {
          prop: 'skuCode',
          label: '商品编码',
          minWidth: 120,
          'show-overflow-tooltip': true,
        },
        {
          prop: 'skuName',
          label: '商品名称',
          minWidth: 120,
          'show-overflow-tooltip': true,
        },
        {
          prop: 'skuId',
          label: 'SKU编码',
          minWidth: 120,
          'show-overflow-tooltip': true,
        },
        // todo 产品说了未作功能不显示
        // {
        //   prop: 'skuUnit',
        //   label: '单位',
        //   minWidth: 120,
        //   'show-overflow-tooltip': true,
        // },
        // {
        //   prop: 'skuWeight',
        //   label: '重量(kg)',
        //   minWidth: 120,
        //   'show-overflow-tooltip': true,
        // },
        // {
        //   prop: 'skuVolume',
        //   label: '体积(m2)',
        //   minWidth: 120,
        //   'show-overflow-tooltip': true,
        // },
        {
          prop: 'skuQty',
          label: '购买数量',
          minWidth: 120,
          'show-overflow-tooltip': true,
        },
        {
          prop: 'receivedSkuQty',
          label: '已收货数',
          minWidth: 120,
          'show-overflow-tooltip': true,
        },
      ]
      let listColumn = baseCloumn.slice(0)
      this.status
        ? listColumn
        : listColumn.push(
            {
              prop: 'realReturnSkuQty',
              label: '实际退货数量',
              minWidth: 120,
              'show-overflow-tooltip': true,
            },
            {
              prop: 'applyReturnSkuQty',
              label: '申请退货数量',
              minWidth: 120,
              'show-overflow-tooltip': true,
            },
          )
      return listColumn
    },
  },
  watch: {
    goodList: {
      handler(val) {
        this.$nextTick(() => {
          this.$refs.goodTable.data = val.map(v => {
            let skuVolumes =
              (v.skuLength || '') * (v.skuWidth || '') * (v.skuHeight || '')
            return {
              ...v,
              // todo 产品说了未作功能不显示
              // skuUnit: '未知',
              // skuWeight: '60',
              // skuVolume: '1960',
              receivedSkuQty: v.receivedSkuQty || '', //已收货数量
              applyReturnSkuQty: v.applyReturnSkuQty || '', //申请退货数量
              realReturnSkuQty: v.realReturnSkuQty || '', //实际退货数量
            }
          })
        })
      },
      deep: true,
    },
  },
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.goodList {
  &-tit {
    margin-bottom: 14px;
    .baseOrderTit;
  }
}
</style>
