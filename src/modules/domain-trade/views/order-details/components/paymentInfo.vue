<template>
  <div class="InvoiceInfo">
    <div class="InvoiceInfo-tit">
      {{ status ? '支付信息' : '退款信息' }}
    </div>
    <div>
      <data-mapper
        :data="payDetails"
        :columns="payList"
        :is-cloumn-show="true"
      ></data-mapper>
    </div>
  </div>
</template>

<script>
import DataMapper from '~/modules/domain-trade/components/DataMapper'
import {PAY_TYPE, ORDER_SALE_STATUS} from '~/modules/domain-trade/const/const'
import dayJs from 'dayjs'

export default {
  name: 'InvoiceInfo',
  components: {
    DataMapper,
  },
  props: {
    paymentDetails: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      payDetails: {},
    }
  },
  inject: ['status'],
  computed: {
    payList() {
      // 销售管理支付
      const orderPay = [
        {
          label: '订单金额',
          prop: 'originalTotalAmount',
        },
        {
          label: '运费',
          prop: 'freight',
        },
        {
          label: '优惠金额',
          prop: 'changeAmount',
        },
        {
          label: '应付金额',
          prop: 'payableAmount',
        },
        {
          label: '实付金额',
          prop: 'realPayAmount',
        },
        {
          label: '支付方式',
          prop: 'payType',
        },
      ]
      // 售后支付方式
      const afterSalePay = [
        {
          label: '实付金额',
          prop: 'realPayAmount',
        },
        {
          label: '申请退款金额',
          prop: 'refundAmountApply',
        },
        {
          label: '退款状态',
          prop: 'refundStatus',
        },
        {
          label: '实际退款金额',
          prop: 'realRefundAmount',
        },
        {
          label: '退款时间',
          prop: 'refundTime',
        },
        {
          label: '退款方式',
          prop: 'refundMethods',
        },
      ]
      return this.status ? orderPay : afterSalePay
    },
  },
  watch: {
    paymentDetails: {
      deep: true,
      handler(val) {
        this.payDetails = {
          ...val,
          payType:
            (PAY_TYPE.find(v => v.value == val.payType) || {}).label || '',
          originalTotalAmount: Number(val.originalTotalAmount).toFixed(2),
          freight: Number(val.freight ? val.freight : '').toFixed(2),
          changeAmount: Number(
            val.changeAmount ? val.changeAmount : '',
          ).toFixed(2),
          payableAmount: Number(
            val.payableAmount ? val.payableAmount : '',
          ).toFixed(2),
          realPayAmount: val.realPayAmount ? val.realPayAmount : '',
          refundAmountApply: val.refundAmountApply ? val.refundAmountApply : '',
          realRefundAmount: val.realRefundAmount ? val.realRefundAmount : '',
          refundTime: dayJs(val.refundTime).format('YYYY-MM-DD HH:mm:ss'),
          refundMethods: val.refundMethods == 1 ? '仅退款' : '退货退款',
          refundStatus: (
            ORDER_SALE_STATUS.find(v => v.orderStatus == val.refundStatus) || {}
          ).label,
        }
      },
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
