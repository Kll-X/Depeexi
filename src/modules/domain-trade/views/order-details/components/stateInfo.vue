<template>
  <div class="stateInfo">
    <div class="stateInfo-tit">
      {{ status ? '订单基本信息' : '退款基本信息' }}
    </div>
    <div :class="['stateInfo-step', isCancel ? 'width200' : '']">
      <el-steps :active="orderStatusStep" align-center>
        <el-step
          v-for="(item, index) of orderType"
          :title="item.label"
          :key="index"
          :description="item.createdTime"
          icon="el-icon-edit"
        >
          <template slot="icon">
            <svg-icon :icon-class="item.iconClass" class="step-svg-FontSize" />
          </template>
        </el-step>
      </el-steps>
    </div>
    <div class="stateInfo-cont">
      <data-mapper
        :data="orderInfo.orderListData"
        :columns="orderListCloumn"
      ></data-mapper>
    </div>
  </div>
</template>

<script>
import DataMapper from '~/modules/domain-trade/components/DataMapper'
import {
  ORDER_STATUS,
  ORDER_SALE_STATUS,
} from '~/modules/domain-trade/const/const'
import dayJs from 'dayjs'

export default {
  name: 'StateInfo',
  components: {
    DataMapper,
  },
  props: {
    //订单基本信息
    orderInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      childfooOld: this.status,
    }
  },
  inject: ['status'],
  computed: {
    isCancel() {
      const orderStatus = this.orderInfo.orderListData.status
      if (
        (this.status == 0 && orderStatus == 2) ||
        (this.status == 1 && orderStatus == 8)
      ) {
        return true
      }
      return false
    },
    orderStatusStep() {
      const orderStatus = this.orderInfo.orderListData.status
      if (this.status == 0 && orderStatus == 6) {
        return 5
      }
      return orderStatus
    },
    orderType() {
      // 8 2 取消
      const orderStatus = this.orderInfo.orderListData.status
      const timeStart =
        dayJs(this.orderInfo.orderListData.createdTime).format(
          'YYYY-MM-DD HH:mm:ss',
        ) || ''
      const goodsStatus =
        (this.status == 1 && orderStatus == 8) ||
        (this.status == 0 && (orderStatus == 2 || orderStatus == 8))
      const OrderStatusList = !!this.status ? ORDER_STATUS : ORDER_SALE_STATUS
      const stepList = OrderStatusList.map(v => {
        const findStatus = this.orderInfo.statusLogList.find(
          q => v.orderStatus === String(q.status),
        )
        return {
          ...{
            ...v,
            label: v ? (v.label == '全部' ? '提交订单' : v.label) : '',
            ...findStatus,
            createdTime:
              v.label == '全部'
                ? timeStart
                : findStatus
                ? dayJs(findStatus.createdTime).format('YYYY-MM-DD HH:mm:ss')
                : '',
          },
        }
      }).filter(
        v =>
          v.label !== '已取消' && v.label !== '已删除' && v.label !== '退款中',
      )
      const cancelArr = [
        {
          label: '提交订单',
          iconClass: 'tijiaodingdan-on',
          completeIcon: 'tijiaodingdan',
          orderStatus: '',
        },
        {
          label: '已取消',
          iconClass: 'guanbi-on',
          completeIcon: 'guanbi',
          orderStatus: '8',
        },
      ]
      return !goodsStatus
        ? stepList
        : cancelArr.map(v => {
            const findStatus = this.orderInfo.statusLogList.find(
              q => v.orderStatus === String(q.status),
            )
            return {
              ...{
                ...findStatus,
                createdTime: findStatus
                  ? dayJs(findStatus.createdTime).format('YYYY-MM-DD HH:mm:ss')
                  : timeStart,
                ...v,
              },
            }
          })
    },
    orderListCloumn() {
      const orderList = [
        {
          label: '订单编号',
          prop: 'saleOrderNo',
        },
        // {
        //   label: '渠道单号',
        //   prop: 'channelOrderNo',
        // },
        {
          label: '来源渠道',
          prop: 'sourceChannel',
        },
        {
          label: '来源店铺',
          prop: 'sellerName',
        },
        {
          label: '商品数量',
          prop: 'goodsNum',
        },
        {
          label: `${!!this.status ? '订单' : '退款'}金额`,
          prop: 'originalTotalAmount',
        },
      ]
      return orderList
    },
  },
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.width200 {
  width: 230px;
}

.stateInfo {
  .padd-20;
  .borderRadius-10;

  &-tit {
    margin-bottom: 14px;
    .baseOrderTit;
  }

  &-step {
    padding: 30px 37px 20px 30px;

    .step-svg-FontSize {
      font-size: 40px;
    }
  }
}
</style>
