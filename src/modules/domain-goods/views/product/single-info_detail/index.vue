<template>
  <div v-loading="containerLoading" class="single-info-detail">
    <!-- 基本信息 -->
    <basic-info
      :property-info="keyPropertyInfo"
      :data="basicInfoData"
      class="basic-info card"
    ></basic-info>
    <!-- 商品销售属性 -->
    <sales-properties-info
      v-loading="skuInfoLoading"
      :property-list="salesPropertyList"
      :data="salesInfo"
      title="商品销售属性"
      class="sales-properties-info card"
    ></sales-properties-info>
    <!-- 其他商品属性 -->
    <others-info
      :property-info="noKeyPropertyInfo"
      title="商品其他属性"
      class="others-info card"
    ></others-info>
    <!-- 商品图片描述信息 -->
    <detail-info
      :data="detailInfo"
      title="商品图片描述信息"
      class="detail-info card"
    ></detail-info>
    <div class="buttons_group">
      <el-button type="primary" size="small" @click="$router.back()"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import basicInfo from './components/basic-info'
import othersInfo from './components/others-info'
import salesPropertiesInfo from './components/sales-properties-info'
import DetailInfo from './components/detail-info'

import {
  getbackCategoryPropertyRelation,
  getCommodityGoodSingle,
} from '^domain-goods/services/commodity-center.js'
import {treeToArray, arrayToTree} from '^domain-goods/const/tree-utils'

export default {
  name: 'SingleInfoDetail',
  components: {
    basicInfo,
    othersInfo,
    salesPropertiesInfo,
    DetailInfo,
  },
  data() {
    return {
      commodityInfo: {},
      basicInfoData: {},
      otherProperties: {},
      categoryId: null,
      // categoryName: null,
      categoryList: null,
      salesInfo: [], // 销售属性sku
      propertyList: null, // 属性列表
      keyPropertyList: null, // 关键属性列表
      noKeyPropertyList: null, // 非关键属性列表
      salesPropertyList: null, // 销售商品规格
      detailInfo: [], // 详情
      containerLoading: false,
      propertyInfo: [],
      keyPropertyInfo: [],
      noKeyPropertyInfo: [],
      skuInfoLoading: false,
    }
  },
  computed: {
    commodityId() {
      return this.$route.params.id
    },
  },
  watch: {
    categoryId(val, oldVal) {
      if (val !== oldVal) {
        this.fetchPropertyTree()
      }
    },
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.containerLoading = true
      getCommodityGoodSingle(this.commodityId)
        .then(res => {
          const {payload, code} = res
          if (payload && code) {
            this.commodityInfo = payload
            const {itemWhole = {}, sku = []} = payload
            const {
              categoryId,
              itemDetail: detailInfo,
              ...basicInfoData
            } = itemWhole
            // 数据判空
            const itemProperty = itemWhole.itemProperty || []
            sku.forEach(item => {
              const skuPropertyValueList = item.skuPropertyValue || []
              skuPropertyValueList.forEach(info => {
                // id : value
                item[info['propertyId']] = info['propertyValue']
              })
            })
            // 获取属性值
            const propertyInfo = itemProperty.map(item => {
              const propertyValue =
                item.itemPropertyValue[0] &&
                item.itemPropertyValue[0].propertyValue
              return {
                propertyId: item.propertyId,
                propertyValue,
                propertyName: item.propertyName,
                propertyType: item.propertyType,
              }
            })

            this.propertyInfo = propertyInfo
            this.keyPropertyInfo = propertyInfo.filter(
              item => item.propertyType === '1',
            )
            this.noKeyPropertyInfo = propertyInfo.filter(
              item => item.propertyType === '3',
            )

            this.basicInfoData = basicInfoData
            this.detailInfo = detailInfo
            this.salesInfo = sku
            this.categoryId = categoryId
          }
        })
        .catch(() => {})
        .finally(() => {
          this.containerLoading = false
        })
    },
    // 请求属性列表树
    fetchPropertyTree() {
      // 请求属性树，用于处理sku属性列表
      this.skuInfoLoading = true
      getbackCategoryPropertyRelation({id: this.categoryId})
        .then(({payload}) => {
          // 将树扁平化
          const propertyList = treeToArray(
            payload,
            {parentId: 'parentId', level: 0, children: 'children'},
            true,
          )
          this.propertyList = propertyList
          // 设置销售属性列表
          this.$set(
            this,
            'salesPropertyList',
            propertyList.filter(
              info =>
                info.propertyTypes && info.propertyTypes.toString() === '2',
            ),
          )
        })
        .finally(() => {
          this.skuInfoLoading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/status.less';
@import '~^domain-goods/styles/var.less';

.single-info-detail {
  height: 100%;
  background: @color__none-content-bg;

  .card {
    margin-bottom: 24px;
  }

  //   .cards-container {
  //     min-height: calc(100% - 60px);
  //   }

  .buttons_group {
    text-align: center;
    padding: 12px;
    height: 36px;
    background: @color__buttons-group-bg;
  }
}
</style>
