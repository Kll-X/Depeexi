<template>
  <div class="order">
    <div class="tab-group">
      <el-radio-group v-model="orderType" text-color="#5D81F9">
        <el-radio-button
          v-for="(item, index) in orderStauts"
          :key="index"
          :label="item.orderStatus"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>
    <order-table
      :order-stauts="orderStauts"
      :order-type="orderType"
      class="order-table"
    ></order-table>
  </div>
</template>

<script>
import {ORDER_STATUS} from '~/modules/domain-trade/const/const'
import OrderTable from './components/orderTable'
import {RadioGroup, RadioButton} from 'element-ui'
export default {
  components: {
    [OrderTable.name]: OrderTable,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  data() {
    return {
      orderType: '',
      orderStauts: ORDER_STATUS,
    }
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
