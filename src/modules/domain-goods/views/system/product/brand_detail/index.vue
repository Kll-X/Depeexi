<template>
  <div class="product_brand_detail">
    <div class="card-box">
      <detail-card v-loading="infoLoading" :data="data" title="品牌信息">
        <div slot="attachmentPath" slot-scope="{value}">
          <!-- <img v-show="value" :src="value" class="srcUrl" /> -->
          <UploadToAli
            style="width:60px;height:60px"
            v-if="value"
            :value="value"
            class="upload"
            disabled
          />
        </div>
      </detail-card>
    </div>
    <div class="buttons_group">
      <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import DetailCard from '^domain-goods/components/detail-card'
import UploadToAli from '@femessage/upload-to-ali'
import {getBrandManagement} from '^domain-goods/services/commodity-center.js'
import dayjs from 'dayjs'
const BRAND_CHART = {
  code: '品牌编码',
  chineseName: '品牌中文名称',
  englishName: '品牌英文名称',
  attachmentPath: 'LOGO',
  // introduction: '品牌介绍',
  updatedTime: '更新时间',
}

export default {
  name: 'BrandDetail',
  components: {
    DetailCard,
    UploadToAli,
  },
  data() {
    return {
      infoLoading: false,
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
      getBrandManagement({id: this.getId})
        .then(({payload}) => {
          const data = []
          // 组装详情数据，如
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
          for (const item in BRAND_CHART) {
            const dataItem = {
              label: BRAND_CHART[item],
              value: payload[item] || null,
              id: item,
            }
            if (item === 'updatedTime') {
              dataItem.formatter = v => {
                return dayjs(v.value).format('YYYY-MM-DD HH:mm:ss')
              }
            }
            data.push(dataItem)
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
.product_brand_detail {
  height: 100%;
  position: absolute;
  top: 0;
  background-color: #f0f2f5;
  bottom: 0;
  left: 0;
  right: 0;

  .card-box {
    min-height: calc(100% - 60px);
    .detail-card {
      .srcUrl {
        width: 60px;
        height: 60px;
        border: 1px solid #e4e8f3;
      }
    }
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
<style lang="less">
.product_brand_detail {
  section {
    &.upload .upload-item-wrapper {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
