<template>
  <div class="success-container">
    <div class="success_img">
      <img src="@/assets/img/success.png" />
    </div>
    <div class="message">恭喜你，新增商品成功！</div>
    <div class="button-list">
      <el-button @click="backToList">返回列表</el-button>
      <el-button type="primary" @click="continueAdd">继续新增</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backToList() {
      this.$router.push({
        path: '/product/single-info',
      })
    },
    // 继续添加
    continueAdd() {
      // this.$router.replace({
      //   path: '/new-commodity',
      //   query: {}
      // })
      this.$emit('handle-continue')
    },
  },
}
</script>

<style scoped lang="less">
@import '~^domain-goods/styles/var.less';

.success-container {
  padding-top: 100px;
  text-align: center;

  .success_img {
    width: 117px;
    height: 117px;
    margin: 0 auto 40px auto;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .message {
    margin-bottom: 40px;
    color: @--color-text-primary;
    // font-weight: 500;
    font-size: 14px;
    // line-height: 32px;
  }

  .button-list {
    // margin-top: 32px;
    text-align: center;
  }
}
</style>
