<template>
  <div class="order">
    <div class="tab-group">
      <el-radio-group v-model="orderType" text-color="#5D81F9">
        <el-radio-button
          v-for="(item, index) in orderSaleStauts"
          :key="index"
          :label="item.orderStatus"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <order-sale-table
      :order-sale-stauts="orderSaleStauts"
      :order-type="orderType"
      class="order-table"
    ></order-sale-table>
  </div>
</template>

<script>
import {ORDER_SALE_STATUS} from '~/modules/domain-trade/const/const'
import OrderSaleTable from './components/orderSaleTable'
import {RadioGroup, RadioButton} from 'element-ui'

export default {
  components: {
    [OrderSaleTable.name]: OrderSaleTable,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  data() {
    return {
      orderType: '',
      orderSaleStauts: [],
    }
  },
  created() {
    this.orderSaleStauts = ORDER_SALE_STATUS.filter(
      v => v.label !== '退款中' && v.label !== '已删除',
    )
  },
}
</script>

<style lang="less">
@import url('../../style/mixins.less');

.order {
  padding: 20px;
  // min-width: 750px;

  &-table {
    margin-top: 30px;
  }

  & .tab-group {
    .btnColor;
  }
}
</style>
