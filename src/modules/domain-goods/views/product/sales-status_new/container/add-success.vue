<template>
  <div class="success-container">
    <div v-show="uploadingSuccess !== 1" class="uploading">
      <div class="icon">
        <span class="icon-text">{{ percentage }}%</span>
      </div>
      <div class="message">正在上传中，请稍后，请勿关闭此页面</div>
    </div>

    <div v-show="uploadingSuccess === 1" class="success">
      <div class="success_img">
        <img src="@/assets/img/success.png" />
      </div>
      <div class="message">
        上传成功
        <span class="message__success">{{ successNum }}</span>
        商品信息，失败
        <span class="message__failure">{{ failureNum }}</span>
        条商品信息
        <p v-if="failureNum > 0">
          （
          <el-button type="text" @click="exportTable" size="middle">下载</el-button>失败记录
          ）
        </p>
      </div>
      <div class="button-list">
        <el-button @click="backToList">返回列表</el-button>
        <el-button type="primary" @click="continueAdd">继续发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {exportExcel} from '@femessage/excel-it'
import {templateColumns} from '^domain-goods/const/export-goods-template-columns'

export default {
  props: {
    percentage: {
      type: [Number],
      default: 0,
    },
    failureNum: {
      type: Number,
      default: 0,
    },
    hasRes: {
      type: Boolean,
      default: false,
    },
    successNum: {
      type: Number,
      default: 0,
    },
    failureInfo: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      tableColumns: [],
    }
  },
  computed: {
    uploadingSuccess() {
      return this.percentage === 100 && this.hasRes ? 1 : 0
    },
  },
  methods: {
    backToList() {
      this.$router.push({
        path: '/product/sales-status',
      })
    },
    // 继续添加
    continueAdd() {
      this.$emit('handle-continue')
    },
    exportTable() {
      exportExcel(
        {
          columns: Object.keys(templateColumns).map(k => ({
            prop: k,
            label: templateColumns[k],
          })),
          data: this.failureInfo,
          fileName: '商品信息表',
        },
        () => {
          this.$message.success('导出表格成功')
        },
      )
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.success-container {
  padding-top: 100px;
  text-align: center;

  .success {
    &_img {
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
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;

      &__success {
        color: @color__success;
      }

      &__failure {
        color: @color__danger;
      }
    }

    .button-list {
      margin-top: 32px;
      text-align: center;
    }
  }

  .uploading {
    .icon {
      margin: 0 auto;
      width: 50px;
      height: 50px;
      background: rgba(@color__process, 0.15);
      border-radius: 50%;
      margin-bottom: 12px;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon-text {
        color: @color__process;
        font-size: 16px;
        line-height: 22px;
      }
    }

    .message {
      &::after {
        content: '......';
        display: inline-block;
        position: absolute;
        animation: dot 7s linear 0s infinite;
      }
    }

    @keyframes dot {
      0% {
        content: '.';
      }

      20% {
        content: '..';
      }

      40% {
        content: '...';
      }

      60% {
        content: '....';
      }

      80% {
        content: '.....';
      }

      100% {
        content: '......';
      }
    }
  }
}
</style>
