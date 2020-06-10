<template>
  <div class="parcelInfo">
    <div v-if="parcelArr.length">
      <div v-for="(item, index) of parcelArr" :key="index">
        <div class="parcelInfo-head">
          <div class="parcelInfo-head-tit">包裹明细 {{ index }}</div>
          <div class="parcelInfo-head-btn"></div>
        </div>
        <div class="parcelInfo-cont">
          <div class="parcelInfo-cont-table">
            <el-table :data="item.packItems" style="width: 100%;">
              <el-table-column prop="skuCode" label="商品编码">
              </el-table-column>
              <el-table-column prop="skuName" label="商品名称">
              </el-table-column>
              <el-table-column prop="skuId" label="SKU编码"> </el-table-column>
              <!-- // todo 产品说了未作功能不显示 -->
              <!-- <el-table-column prop="skuUnit" label="单位"> </el-table-column>
              <el-table-column prop="skuWeight" label="重量(kg)">
              </el-table-column>
              <el-table-column prop="skuVolume" label="体积(m2)">
              </el-table-column> -->
              <el-table-column prop="deliveryQty" label="发货数量">
              </el-table-column>
              <el-table-column prop="deliveryWarehouse" label="建议发货仓库">
              </el-table-column>
              <el-table-column prop="deliveryExpress" label="建议发货快递">
              </el-table-column>
            </el-table>
          </div>
          <template v-if="isHasLogistics">
            <div class="parcelInfo-cont-logis">
              <el-row :gutter="20">
                <el-col :span="6">
                  物流单号: {{ item.logistics.logisticsNo }}
                </el-col>
                <el-col :span="12">
                  物流快递: {{ item.logistics.expressCompName }}
                </el-col>
              </el-row>
            </div>
            <div class="parcelInfo-cont-logisInfo">
              <div class="parcelInfo-cont-logisInfo-tit">
                物流明细：
              </div>
              <div class="parcelInfo-cont-logisInfo-cont">
                <el-steps :active="1" :space="50" direction="vertical">
                  <el-step
                    v-for="(v, i) of item.logistics.logisticsDetails"
                    :title="v.stepDesc"
                    :key="i"
                  ></el-step>
                </el-steps>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="no_data">
      暂无数据
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParcelInfo',
  components: {},
  props: {
    parcelArr: {
      type: Array,
      default: () => [],
    },
    orderInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isHasLogistics: false,
    }
  },
  inject: ['status'],
  beforeMount() {
    // 销售管理-代发货
    this.isHasLogistics =
      this.orderInfo.orderListData.status == 6 ? true : false
  },
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.parcelInfo {
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    &-tit {
      margin-bottom: 14px;
      .baseOrderTit;
    }
  }

  &-cont {
    &-logis {
      margin-top: 20px;
    }

    &-logisInfo {
      display: flex;
      justify-content: flex-start;
      margin-top: 20px;

      &-cont {
        margin-left: 20px;
      }
    }
  }

  .no_data {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
