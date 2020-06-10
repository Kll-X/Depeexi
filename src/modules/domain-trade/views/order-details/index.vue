<template>
  <div v-loading="orderInfoLoading" class="orderDetails">
    <el-row class="orderDetails-head">
      <el-col :span="4" class="orderDetails-head-orderState">
        <goods-info
          :goods-info="orderDetailsInfo.orderInfo"
          :good-list="orderDetailsInfo.goodList"
        ></goods-info>
      </el-col>
      <el-col :span="20" class="orderDetails-head-orderBaseInfo">
        <state-info :order-info="orderDetailsInfo.saleOrderInfo"></state-info>
      </el-col>
    </el-row>
    <div class="orderDetails-cont">
      <div class="orderDetails-cont-harvest">
        <buy-user-info
          :sale-order-delivery="orderDetailsInfo.saleOrderDelivery"
        ></buy-user-info>
      </div>
      <div class="orderDetails-cont-payInfo">
        <payment-info
          :payment-details="orderDetailsInfo.paymentDetails"
        ></payment-info>
      </div>
      <div class="orderDetails-cont-invoice">
        <invoice-info
          :sale-order-invoice="orderDetailsInfo.saleOrderInvoice"
        ></invoice-info>
      </div>
    </div>
    <div v-if="isShowParcelInfo" class="orderDetails-parcel">
      <parcel-info
        :parcel-arr="orderDetailsInfo.logisticsPacks"
        :order-info="orderDetailsInfo.saleOrderInfo"
      ></parcel-info>
    </div>
    <div v-if="isShowLogis" class="orderDetails-logis">
      <logistics-info
        :after-logis-info="orderDetailsInfo.afterLogisInfo"
      ></logistics-info>
    </div>
    <div class="orderDetails-footer">
      <good-list :good-list="orderDetailsInfo.goodList"></good-list>
    </div>
  </div>
</template>

<script>
import PaymentInfo from './components/paymentInfo' //支付及退款信息
import BuyUserInfo from './components/buyUserInfo' //买家信息
import InvoiceInfo from './components/invoiceInfo' //发票信息
import StateInfo from './components/stateInfo' //订单流转状态信息
import GoodsInfo from './components/goodsInfo' //订单状态
import GoodList from './components/goodList' //商品明细
import LogisticsInfo from './components/logisticsInfo' //物流明细
import ParcelInfo from './components/parcelInfo' //商品明细
import DataMapper from '~/modules/domain-trade/components/DataMapper'
import {
  getOrderBaseInfo,
  getAfterOrderBaseInfo,
} from '~/modules/domain-trade/services/v1/domain-trade-api'

export default {
  name: 'Detail',
  components: {
    DataMapper,
    GoodList,
    BuyUserInfo,
    InvoiceInfo,
    GoodsInfo,
    StateInfo,
    LogisticsInfo,
    PaymentInfo,
    ParcelInfo,
  },
  data() {
    return {
      orderInfoLoading: false,
      orderDetailsInfo: {
        saleOrderInfo: {
          //订单信息
          orderListData: {},
          statusLogList: [],
        },
        paymentDetails: {}, // 支付信息
        saleOrderInvoice: {}, // 发票信息
        logisticsPacks: [], //包裹明细
        afterLogisInfo: {}, //售后物流信息
        saleOrderDelivery: {}, // 买家信息
      },
      isShowParcelInfo: false, // 包裹明细
    }
  },
  provide() {
    return {
      status: Number(this.$route.query.status), // 0 售后 1订单
    }
  },
  computed: {
    isShowLogis() {
      const status = this.orderDetailsInfo.saleOrderInfo
        ? this.orderDetailsInfo.saleOrderInfo.orderListData.status
        : ''
      //待验货 5 待退款 4 已完成 5
      const afterStatus = status == 3 || status == 4 || status == 5
      return this.$route.query.status == 0 && afterStatus
    },
  },
  async created() {
    this.orderInfoLoading = true
    const {id, type, status} = this.$route.query
    if (!id) return
    const orderBaseInfo = !!Number(status)
      ? getOrderBaseInfo(id)
      : getAfterOrderBaseInfo(id)

    try {
      await orderBaseInfo.then(({payload: v}) => {
        const details = (this.orderDetailsInfo = {
          ...v,
          saleOrderInfo: {
            statusLogList: v.statusLogList || [],
            orderListData:
              (v.saleOrderInfo
                ? {
                    ...v.saleOrderInfo,
                    originalTotalAmount: Number(
                      v.saleOrderInfo.originalTotalAmount,
                    ).toFixed(2),
                    sourceChannel: '移动商城',
                  }
                : {
                    ...v.afterSaleOrderInfo,
                    goodsNum: v.afterSaleOrderInfo.goodsReturnNum,
                    originalTotalAmount: Number(
                      v.afterSaleOrderInfo.applyTotalAmount,
                    ).toFixed(2),
                    sourceChannel: '移动商城',
                  }) || {},
          },
          paymentDetails:
            // todo 对应多个支付流水
            v.paymentDetails
              ? {
                  ...v.paymentDetails[0],
                  ...v.saleOrderInfo,
                }
              : {
                  ...v.refundDetail,
                  ...v.afterSaleOrderInfo,
                },
          saleOrderInvoice:
            (v.saleOrderInvoice ? v.saleOrderInvoice : v.invoiceInfo) || {},
          saleOrderDelivery:
            (v.saleOrderDelivery
              ? v.saleOrderDelivery
              : v.afterSaleOrderDelivery) || {},
          goodList: v.saleOrderItems || [],
          logisticsPacks: v.logisticsPacks || [],
          afterLogisInfo: v.afterSaleLogistics || {},
          orderInfo:
            (v.saleOrderInfo ? v.saleOrderInfo : v.afterSaleOrderInfo) || {},
        })
        const orderSatus = this.orderDetailsInfo.saleOrderInfo.orderListData
          .status
        this.isShowParcelInfo =
          (orderSatus == '6' || orderSatus == '7' || orderSatus == '5') &&
          this.$route.query.status == 1
      })
    } catch (error) {}
    this.orderInfoLoading = false
  },
}
</script>

<style scoped lang="less">
@import url('./style/orderInfo.less');

.rowDisplay {
  display: inline-flex;
}

.leftPadd-20 {
  margin-left: 20px;
}

.topPadd-20 {
  margin-top: 20px;
}

.bgFFF {
  background-color: #fff;
}

.orderDetails {
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  min-width: 1024px;

  &-head {
    .rowDisplay;

    &-orderState {
      height: 298px;
      background: red;
      .bgFFF;
      .borderRadius-10;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-orderBaseInfo {
      .leftPadd-20;

      height: 298px;
      .bgFFF;
      .borderRadius-10;
    }
  }

  &-cont {
    .topPadd-20;
    .rowDisplay;

    display: flex;
    justify-content: space-between;
    height: 382px;

    &-harvest {
      width: 33%;
      .borderRadius-10;
      .bgFFF;
    }

    &-payInfo {
      width: 33%;
      .leftPadd-20;
      .bgFFF;
      .borderRadius-10;
    }

    &-invoice {
      .borderRadius-10;

      width: 33%;
      .leftPadd-20;
      .bgFFF;
    }
  }

  &-parcel {
    .borderRadius-10;
    .topPadd-20;
    .padd-20;
    .bgFFF;
  }

  &-logis {
    .borderRadius-10;
    .topPadd-20;
    .padd-20;
    .bgFFF;
  }

  &-footer {
    .borderRadius-10;
    .topPadd-20;
    .padd-20;
    .bgFFF;

    margin-bottom: 20px;
  }
}
</style>
