<template>
  <div class="sales-status_new">
    <div class="content">
      <el-steps
        :active="activeIndex"
        class="steps-bar"
        finish-status="finish"
        simple
      >
        <el-step
          v-for="(item, index) in steps"
          :title="item.title"
          :key="index"
          class="step-item"
          @click.native="jumpTargetStep(item)"
        >
          <div slot="icon">{{ index + 1 }}</div>
        </el-step>
      </el-steps>

      <div v-show="activeIndex === 0 || activeIndex === 1">
        <goods-configuration
          ref="goodsConfiguration"
          :re-set.sync="reSet"
          :step-index="activeIndex"
          @change="handleChange"
        ></goods-configuration>
      </div>

      <div v-show="activeIndex === 2">
        <add-success
          :percentage="percentage"
          :failure-num="failureNum"
          :success-num="successNum"
          :failure-info="failureInfo"
          :has-res="hasRes"
          @handle-continue="addMore"
        ></add-success>
      </div>
    </div>

    <div v-show="activeIndex !== 2" class="buttons_group">
      <el-button
        v-show="activeIndex > 0"
        type="primary"
        size="small"
        @click="changeCurrentActiveIndex(activeIndex - 1)"
        >上一步</el-button
      >
      <el-button
        size="small"
        @click="
          $router.push({
            path: `/product/sales-status`,
          })
        "
        >取消</el-button
      >
      <el-button
        v-show="activeIndex < 2"
        :disabled="tableData && tableData.length === 0"
        type="primary"
        size="small"
        @click="nextStep()"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {Steps, Step} from 'element-ui'
import goodsConfiguration from './container/goods-configuration'
import addSuccess from './container/add-success'
import axios from '@/services/apiClient'
import {postCommodityShelves} from '^domain-goods/services/commodity-center.js'
import {addProps} from '^domain-goods/const/utils.js'

export default {
  components: {
    ElSteps: Steps,
    ElStep: Step,
    goodsConfiguration,
    addSuccess,
  },
  data() {
    const {activeIndex} = this.$route.query
    return {
      activeIndex: Number(activeIndex) || 0,
      percentage: 100,
      failureNum: 0,
      successNum: 0,
      tableData: [],
      failureInfo: [],
      reSet: false,
      hasRes: true,
      steps: [
        {
          id: 0,
          title: '选择上架商品',
        },
        {
          id: 1,
          title: '配置上下架策略',
        },
        {
          id: 2,
          title: '完成',
        },
      ],
    }
  },
  computed: {
    userInfo() {
      const {tenantId, appId} = this.$store.state.user
      return {
        tenantId,
        appId,
      }
    },
  },
  methods: {
    handleChange(data) {
      this.tableData = data
    },
    // 更改当前的选中状态
    changeCurrentActiveIndex(index, params) {
      this.activeIndex = index
      this.$router
        .push({
          query: {
            ...this.$route.query,
            activeIndex: index,
            ...params,
          },
        })
        .catch(res => {})
    },
    // 跳到指定步骤
    jumpTargetStep(item) {
      const {id} = item
      if (id === 0 && this.activeIndex === 1) {
        this.handleBackType()
      }
    },
    // 数据重整
    transformMethod(data) {
      return data.map(v => {
        const res = {}
        const {inventoryRatio} = v
        const skuList = {
          skuId: v.skuId,
          skuQty: inventoryRatio || 0,
        }
        // res['channelId'] = 0
        res['itemId'] = v.itemId || null
        // res['priceSystemId'] = 0
        // res['shopId'] = 0
        res['skuList'] = [skuList]
        res['status'] = 1 // 上架状态
        res.shopId = Number((Math.random() * 10000000000000).toFixed(0))
        res.channelId = Number((Math.random() * 10000000000000).toFixed(0))
        res.priceSystemId = Number((Math.random() * 10000000000000).toFixed(0))
        return res
      })
    },
    // 商品详情中点击跳转到上一步
    handleBackType() {
      this.changeCurrentActiveIndex(0)
    },
    // 上传填写的商品信息
    uploadGoodsInformation() {
      let failureData = []
      this.percentage = 0
      const params = this.transformMethod(this.tableData)
      this.hasRes = false
      addProps(params, this.userInfo)
      const allLength = params.length
      postCommodityShelves(params, {
        onUploadProgress: progressEvent => {
          //原生获取上传进度的事件
          if (progressEvent.lengthComputable) {
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
            const {loaded, total} = progressEvent
            this.percentage = Number(((loaded / total) * 100).toFixed(2)) // 截取两位小数，注意强制转为数字
          }
        },
      })
        .then(({payload}) => {
          // 处理返回的上传信息
          this.successNum = payload.length
          this.failureNum = allLength - this.successNum
          failureData = this.tableData.filter(item => {
            return !payload.includes(item.skuId)
          }) // 筛选保存失败的项
        })
        .catch(() => {
          this.failureNum = allLength
          failureData = this.tableData // 全部失败
        })
        .finally(() => {
          this.hasRes = true
          failureData = failureData.map(item => {
            return {
              // systemGoodCode: item.systemGoodCode || '系统商品编码',
              // systemGoodName: item.systemGoodName || '系统商品名称',
              systemGoodSKU: item.systemGoodSKU || '系统商品SKU编码',
              // cannelName: item.cannelName || '渠道名称',
              // shopName: item.shopName || '店铺名称',
              shopCode: item.shopCode || '店铺编码',
              cannelGoodCode: item.cannelGoodCode || '渠道商品编码',
              cannelGoodName: item.cannelGoodName || '渠道商品名称',
              cannelGoodSKU: item.cannelGoodSKU || '渠道商品SKU编码',
            }
          })
          this.failureInfo = [...failureData]
        })
    },
    nextStep() {
      this.$refs.goodsConfiguration &&
        this.$refs.goodsConfiguration.$refs.form.validate(valid => {
          if (valid)
            switch (this.activeIndex) {
              case 1:
                this.uploadGoodsInformation()
              default:
                // 下一步
                this.changeCurrentActiveIndex(this.activeIndex + 1)
                break
            }
        })
    },
    addMore() {
      this.changeCurrentActiveIndex(0)
      // 重置值
      this.reSet = true
      this.hasRes = false
      this.percentage = 0
      this.failureNum = 0
      this.successNum = 0
      this.tableData = []
      this.failureInfo = []
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.sales-status_new {
  height: 100%;
  padding-bottom: 60px;

  .content {
    padding: 20px;
    min-height: calc(100% - 60px - 40px);

    .steps-bar {
      width: 60%;
      margin: 0 auto;
      //   min-width: 720px;
    }
  }

  .buttons_group {
    height: 36px;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 12px 0;
    text-align: center;
    background: @color__buttons-group-bg;
  }
}
</style>
<style lang="less">
@import '~^domain-goods/styles/var.less';

.sales-status_new {
  .el-step.is-simple {
    .el-step__title {
      font-size: 14px;
      font-weight: 400;
    }

    .is-process {
      color: @color__success;
      border: @color__success;
    }

    .is-finish {
      color: @color__finish;
      border: @color__finish;
    }

    .el-step__icon {
      width: 24px;
      height: 24px;
      font-size: 14px;
      font-weight: 500;
      border-width: 1px;
    }
  }
}
</style>
