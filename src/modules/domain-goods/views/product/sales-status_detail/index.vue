<template>
  <div class="sales-status-detail">
    <div class="cards-container">
      <detail-card v-loading="infoLoading" :data="data">
        <template slot="status" slot-scope="{value}">
          <span
            :class="
              `status-text ${STATUS_OPTIONS__SHELVES[value] &&
                STATUS_OPTIONS__SHELVES[value].className}`
            "
            >{{
              STATUS_OPTIONS__SHELVES[value] &&
                STATUS_OPTIONS__SHELVES[value].label
            }}</span
          >
        </template>
      </detail-card>
    </div>
    <div class="buttons_group">
      <el-button type="primary" size="small" @click="$router.back()"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import DetailCard from '^domain-goods/components/detail-card'
import {STATUS_OPTIONS__SHELVES} from '^domain-goods/const/dictionary.js'
import {ArrayToObject} from '^domain-goods/const/array-to-object.js'
import {getCommodityShelves} from '^domain-goods/services/commodity-center.js'

const SALES_STATUS_CHART = {
  cannelName: '渠道名称',
  shopName: '店铺名称',
  systemGoodCode: '系统商品编码',
  systemGoodName: '系统商品名称',
  systemGoodSKU: '系统商品SKU编码',
  cannelGoodCode: '渠道商品编码',
  cannelGoodName: '渠道商品名称',
  cannelGoodSKU: '渠道商品SKU编码',
  status: '上下架状态',
  updatedTime: '更新时间',
}

export default {
  name: 'SalesStatusDetail',
  components: {
    DetailCard,
  },
  data() {
    return {
      infoLoading: false,
      STATUS_OPTIONS__SHELVES: ArrayToObject(STATUS_OPTIONS__SHELVES),
      data: [
        // {label: '商品类目', value: '商品类目', id: 1},
        // {
        //   label: '商品类目',
        //   value: '商品类目',
        //   id: 2,
        //   formatter: () => {
        //     return 'xxxxx1'
        //   },
        //   labelFormatter: () => {
        //     return 'xx'
        //   },
        // },
        // {label: '商品类目', value: '商品类目', id: 3},
        // {label: '商品类目', value: '商品类目', id: 4},
        // {label: '商品类目', value: '商品类目', id: 5},
      ],
    }
  },
  computed: {
    getId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getData()
  },
  methods: {
    transformData(data) {
      const res = {}
      const {itemWholeDTO = {}, skuDTO = {}, updatedTime, status} = data
      res.cannelName = '渠道名称'
      res.shopName = '店铺名称'
      res.systemGoodCode = itemWholeDTO.code
      res.systemGoodName = itemWholeDTO.name
      res.systemGoodSKU = (skuDTO && skuDTO.code) || ''
      res.cannelGoodCode = '渠道商品编码'
      res.cannelGoodName = '渠道商品名称'
      res.cannelGoodSKU = '渠道商品SKU编码'
      res.status = status
      res.updatedTime = dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss')
      return res
    },
    getData() {
      this.infoLoading = true
      getCommodityShelves({id: this.getId})
        .then(res => {
          const data = []
          // 数据名转换
          const dataForm = this.transformData(res.payload)
          for (let item in SALES_STATUS_CHART) {
            data.push({
              label: SALES_STATUS_CHART[item],
              value: dataForm[item],
              id: item,
            })
          }
          this.data = data
        })
        .catch(() => {})
        .finally(() => {
          this.infoLoading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/status.less';
@import '~^domain-goods/styles/var.less';

.sales-status-detail {
  height: 100%;
  position: absolute;
  top: 0;
  background-color: #f0f2f5;
  bottom: 0;
  left: 0;
  right: 0;

  .cards-container {
    min-height: calc(100% - 60px);
  }

  .buttons_group {
    height: 36px;
    width: 100%;
    padding: 12px 0;
    text-align: center;
    background: @color__buttons-group-bg;
  }
}
</style>
