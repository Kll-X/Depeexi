<template>
  <div class="logisticsInfo">
    <div class="logisticsInfo-tit">
      退货物流信息
    </div>
    <div class="logisticsInfo-cont">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            物流单号：{{ afterLogisInfo.logisticsNo }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            物流快递：{{ afterLogisInfo.expressCompName }}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogisticsInfo',
  components: {},
  props: {
    afterLogisInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped lang="less">
@import url('../style/orderInfo.less');

.logisticsInfo {
  &-tit {
    margin-bottom: 14px;
    .baseOrderTit;
  }
}
</style>
