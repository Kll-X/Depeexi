<template>
  <div class="buyUserInfo">
    <div class="buyUserInfo-tit">
      {{ status ? '收货人信息' : '退货人信息' }}
    </div>
    <div>
      <data-mapper
        :data="saleOrderDeliveryInfo"
        :columns="buyUserColumns"
        :is-cloumn-show="true"
      ></data-mapper>
    </div>
  </div>
</template>

<script>
import DataMapper from '~/modules/domain-trade/components/DataMapper'
export default {
  name: 'BuyUserInfo',
  components: {
    DataMapper,
  },
  props: {
    saleOrderDelivery: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      saleOrderDeliveryInfo: {},
    }
  },
  computed: {
    buyUserColumns() {
      const userInfo = [
        {
          label: '收货人',
          prop: 'consignee',
        },
        {
          label: '手机号',
          prop: 'mobile',
        },
        {
          label: '省市区',
          prop: 'code',
        },
        {
          label: '街道',
          prop: 'streetName',
        },
        {
          label: '详细地址',
          prop: 'address',
        },
      ]
      return userInfo
    },
  },
  watch: {
    saleOrderDelivery: {
      deep: true,
      handler(val) {
        this.saleOrderDeliveryInfo = {
          ...val,
          code: `${val.provinceName ? val.provinceName : ''} ${
            val.cityName ? val.cityName : ''
          } ${val.areaName ? val.areaName : ''}`,
        }
      },
    },
  },
  inject: ['status'],
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.buyUserInfo {
  .padd-20;

  &-tit {
    margin-bottom: 14px;
    .baseOrderTit;
  }
}
</style>
