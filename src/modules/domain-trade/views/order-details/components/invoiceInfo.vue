<template>
  <div class="InvoiceInfo">
    <div class="InvoiceInfo-tit">
      发票信息
    </div>
    <div>
      <data-mapper
        :data="saleOrderInvoice"
        :columns="invoiceInfo"
        :is-cloumn-show="true"
      ></data-mapper>
    </div>
  </div>
</template>

<script>
import DataMapper from '~/modules/domain-trade/components/DataMapper'
export default {
  name: 'InvoiceInfo',
  components: {
    DataMapper,
  },
  props: {
    saleOrderInvoice: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  inject: ['status'],
  computed: {
    invoiceInfo() {
      // 销售管理支付
      const invoiceList = [
        {
          label: '抬头类型',
          prop: 'titleType',
        },
        {
          label: '发票类型',
          prop: 'type',
        },
        {
          label: '发票抬头',
          prop: 'title',
        },
        {
          label: '识别号',
          prop: 'number',
        },
      ]
      return invoiceList
    },
  },
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.InvoiceInfo {
  .padd-20;

  &-tit {
    margin-bottom: 14px;
    .baseOrderTit;
  }
}
</style>
