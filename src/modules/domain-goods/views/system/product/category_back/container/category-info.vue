<template>
  <!-- 类目信息 -->
  <div v-loading="loadingDetail" class="category-info-container">
    <div class="header">
      <span>查看类目信息</span>
      <span v-if="ifEdit" class="submit-button">
        <el-button
          :loading="confirmButtonLoading"
          type="text"
          class=" button-primary"
          :disabled="!editInfo.name"
          @click="saveInfo"
        >
         <svg-icon icon-class="anniu-queding" />
         </el-button>
        <el-button type="text" class="button-danger" @click="cancelChange">
          <svg-icon icon-class="anniu-quxiao" />
        </el-button>
      </span>
      <el-button v-else type="text" class="edit-icon" @click="ifEdit = true">
        <svg-icon icon-class="houtai-bianji" />
      </el-button>
    </div>

    <el-row :gutter="0" class="block__body-row">
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">类目编号：</span>
          <el-input
            v-if="ifEdit"
            v-model="detailInfo.id"
            style="max-width: 200px;"
            disabled
            maxlength="32"
          />
          <span v-else class="item-right">{{ detailInfo.id }}</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">类目名称：</span>
          <div class="input-box" v-if="ifEdit" :class="{'is-error': !editInfo.name}">
            
            <el-input style="max-width: 200px;" v-model="editInfo.name"  clearable maxlength="32" />
            <div class="el-form-item__error" v-show="!editInfo.name">请输入类目名称</div>
          </div>
          <span v-else class="item-right">{{ detailInfo.name }}</span>
        </span>
      </el-col>
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">是否启用：</span>
          <el-switch v-if="ifEdit" v-model="editInfo.enabled"></el-switch>
          <span v-else class="item-right">
            {{
            detailInfo.enabled ? '是' : '否'
            }}
          </span>
        </span>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="block__body-row">
      <el-col :span="8">
        <span class="block__body-item">
          <span class="item-left">叶子节点：</span>
          <el-radio-group v-if="ifEdit" v-model="editInfo.leaf">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <span v-else class="item-right">
            {{
            detailInfo.leaf ? '是' : '否'
            }}
          </span>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  putBackCategorysDetail,
  getBackCategorysDetail,
} from '^domain-goods/services/commodity-center.js'

export default {
  name: 'CategoryInfo',
  props: {
    categoryId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      confirmButtonLoading: false,
      detailInfo: {},
      loadingDetail: false,
      editInfo: {},
      ifEdit: false,
    }
  },
  watch: {
    categoryId(val) {
      this.getDetailInfo(val)
    },
  },
  mounted() {
    this.getDetailInfo(this.categoryId)
  },
  methods: {
    // 请求类目详情
    getDetailInfo(id) {
      this.loadingDetail = true
      getBackCategorysDetail({id})
        .then(({payload}) => {
          this.detailInfo = payload
          const {name, enabled, leaf} = payload
          this.editInfo = {
            name,
            enabled,
            leaf,
          }
        })
        .finally(_ => {
          this.loadingDetail = false
        })
    },
    // 保存详情信息
    saveInfo(id = this.categoryId) {
      this.loadingDetail = true
      this.confirmButtonLoading = true
      const form = {
        id,
        ...this.detailInfo,
        ...this.editInfo,
      }
      delete form.createdTime
      delete form.updatedTime
      putBackCategorysDetail(form)
        .then(() => {
          this.ifEdit = false
          this.detailInfo = {
            ...this.detailInfo,
            ...this.editInfo,
          }
          this.$nextTick(() => {
            this.$emit('change', this.detailInfo)
          })
          this.$message.success('修改成功')
        })
        .finally(() => {
          this.confirmButtonLoading = false
          this.loadingDetail = false
        })
    },
    // 取消更改信息
    cancelChange() {
      this.ifEdit = false
      const {name, enabled, leaf} = this.detailInfo
      this.editInfo = {
        name,
        enabled,
        leaf,
      }
    },
  },
}
</script>

<style scoped lang="less">
@import '~^domain-goods/styles/var.less';

.category-info-container {
  padding: 10px 20px;
  font-size: 14px;

  .header {
    height: 50px;
    // font-size: 18px;
    color: #2D303B;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;

    > span:not(:last-child) {
      margin-right: 15px;
    }
  }

  .block__body-row {
    display: flex;
    align-items: flex-start;
    line-height: 20px;

    .block__body-item {
      display: flex;
      align-items: flex-start;

      .item-left {
        color: @--color-text-primary;
        white-space: nowrap;
      }

      .item-right {
        color: @--color-text-secondary;
      }
    }

    &:not(:last-of-type) {
      margin-bottom: 20px;
    }
  }

  .edit-icon {
    font-size: 14px;
  }

  .submit-button {
    .button-primary {
      font-size: 14px;
      color: @--color-primary;
    }

    .button-danger {
      font-size: 14px;
      color: @--color-danger;
    }

    > span:not(:last-child) {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.category-info-container {
  .is-error {
    position: relative;
    .el-input__inner {
      border-color: #e24156;
    }
  }
}
</style>
