<template>
  <div class="recommendation">
    <p class="recommendation__regular">“精选” 推荐规则</p>

    <div class="regulat-content">
      <p>
        <label>
          <el-checkbox
            v-model="regular"
            disabled
            @change="toggleRecommend"
          ></el-checkbox>
        </label>
        默认推荐规则
      </p>
      <p>
        <label></label> 首次推荐规则：依次推荐不同前端类目下销量由大到小的商品
      </p>
      <p>
        <label></label>
        再次推荐规则：依次推荐该会员浏览量前四的前端类目下销量由大到小的商品
      </p>
    </div>
  </div>
</template>

<script>
import {
  getRecommendation,
  changeRecommendation,
} from '../services/recommendations.js'

export default {
  data() {
    return {
      regular: false,
      recommendData: {},
    }
  },
  mounted() {
    getRecommendation().then(res => {
      this.recommendData = res.payload || {}
      this.regular = this.recommendData.status == 1
    })
  },
  methods: {
    toggleRecommend(isUse) {
      changeRecommendation(this.recommendData.id, isUse ? 1 : 0).then(() => {
        this.$message.success('保存成功')
      })
    },
  },
}
</script>

<style scoped lang="less">
.recommendation {
  padding: 20px;

  &__regular {
    font-size: 14px;
    font-weight: 500;
    color: rgba(45, 48, 59, 1);
    line-height: 20px;
    margin-bottom: 20px;
  }

  .regulat-content {
    p {
      margin-bottom: 16px;
      font-weight: 400;
      color: rgba(129, 131, 137, 1);

      label {
        display: inline-block;
        width: 20px;
      }
    }
  }
}
</style>
