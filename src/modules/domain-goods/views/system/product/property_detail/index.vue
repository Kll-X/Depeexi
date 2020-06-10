<template>
  <div class="product_property_detail">
    <div class="card-box">
      <detail-card v-loading="infoLoading" :data="data" title="属性信息">
        <!-- 输出类型 -->
        <template slot="inputType" slot-scope="{value}">
          <span>{{ (INPUT_TYPE[value] && INPUT_TYPE[value].label) || value }}</span>
        </template>
        <!-- 状态 -->
        <template slot="status" slot-scope="{value}">
          <span
            v-if="value"
            :class="[
            'status-text',
            STATUS_OPTIONS__PROPERTY[value] &&
              STATUS_OPTIONS__PROPERTY[value].label,
          ]"
          >
            {{
            (STATUS_OPTIONS__PROPERTY[value] &&
            STATUS_OPTIONS__PROPERTY[value].label) ||
            value
            }}
          </span>
        </template>
        <template slot="propertyValue" slot-scope="{value}">
          <span>{{ value && value.map(v => v.propertyValue).join(',') }}</span>
        </template>
      </detail-card>
    </div>
    <div class="buttons_group">
      <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import DetailCard from '^domain-goods/components/detail-card'
import {
  STATUS_OPTIONS__PROPERTY,
  INPUT_TYPE,
} from '^domain-goods/const/dictionary.js'
import {ArrayToObject} from '^domain-goods/const/array-to-object.js'
import {getCommodityPropertysDetail} from '^domain-goods/services/commodity-center.js'

const PROPERTY_CHART = {
  propertyCode: '属性编码',
  propertyName: '属性名称',
  inputType: '输入方式',
  // status: '状态',
  propertyValue: '属性值',
  // introduction: '品牌介绍',
}

export default {
  name: 'PropertyDetail',
  components: {
    DetailCard,
  },
  data() {
    return {
      infoLoading: false,
      STATUS_OPTIONS__PROPERTY: ArrayToObject(STATUS_OPTIONS__PROPERTY),
      INPUT_TYPE: ArrayToObject(INPUT_TYPE),
      data: [],
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
    getData() {
      this.infoLoading = true
      getCommodityPropertysDetail({id: this.getId})
        .then(({payload}) => {
          const data = []
          // 整理数据， exp
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

          for (let item in PROPERTY_CHART) {
            data.push({
              label: PROPERTY_CHART[item],
              value: payload[item],
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
@import '~^domain-goods/styles/var.less';
@import '~^domain-goods/styles/status.less';

.product_property_detail {
  height: 100%;
  position: absolute;
  top: 0;
  background-color: #f0f2f5;
  bottom: 0;
  left: 0;
  right: 0;
  .card-box {
    min-height: calc(100% - 60px);
    // .detail-card{
    // }
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
