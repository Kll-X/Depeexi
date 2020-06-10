<template>
  <div v-loading="brandloading" class="brand-info">
    <div class="cards-container">
      <form-card :title="title + '品牌'">
        <el-form-renderer
          ref="brandInfo"
          :content="staffInfo"
          class="base-info"
          label-width="120px"
        ></el-form-renderer>
      </form-card>
    </div>
    <div class="buttons_group">
      <el-button @click="$router.back()">取消</el-button>
      <el-button
        :loading="confirmButtonLoading"
        type="primary"
        @click="saveFrom"
        >提交</el-button
      >
    </div>
  </div>
</template>
<script>
import UploadToAliWrap from '^domain-goods/components/upload-to-ali-wrap'
import FormCard from '^domain-goods/components/form-card'
import {
  getBrandManagement,
  postBrandManagement,
  putBrandManagement,
  getBrandRelation,
} from '^domain-goods/services/commodity-center.js'
import {chinesePattern, noneChinesePattern} from '^domain-goods/const/pattern'

export default {
  components: {
    FormCard,
    UploadToAliWrap
  },
  data() {
    // 判断是否详情页进行禁用
    const disabled = this.$route.name.split('-')[1] === 'detail'
    return {
      title: '新增',
      confirmButtonLoading: false,
      brandloading: false,
      staffInfo: [
        {
          $id: 'code',
          $type: 'input',
          label: '品牌编码',
          $el: {
            placeholder: '请输入',
            // style: 'width: 35%',
            // maxlength: 32,
            disabled,
          },
          rules: [
            {
              message: '请输入品牌编码',
              required: true,
              trigger: ['blur', 'change'],
              // whitespace:true
            },
            {
              pattern: noneChinesePattern,
              message: '编码不能带有中文',
              trigger: ['blur', 'change'],
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'chineseName',
          $type: 'input',
          label: '品牌中文名称',
          $el: {
            placeholder: '请输入',
            // style: 'width: 35%',
            // maxlength: 32,
            disabled,
          },
          rules: [
            {
              message: '请输入品牌中文名称',
              required: true,
              trigger: ['blur', 'change'],
              whitespace: true,
            },
            {
              pattern: chinesePattern,
              message: '中文名称必须是中文',
              trigger: ['blur', 'change'],
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'englishName',
          $type: 'input',
          label: '品牌英文名称',
          $el: {
            placeholder: '请输入',
            // style: 'width: 35%',
            // maxlength: 32,
            disabled,
          },
          rules: [
            {
              pattern: noneChinesePattern,
              message: '英文名称不能带有中文',
              trigger: ['blur', 'change'],
            },
            {
              min: 0,
              max: 32,
              message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'attachmentPath',
          component: UploadToAliWrap,
          label: '品牌LOGO',
          $el: {
            // style: 'width: 35%',
            size:300,
            accept: 'image/png,image/jpg,image/jpeg',
            info:"支持jpg/png/jpeg格式，300k以内",
            disabled,
          },
        },
        {
          $id: 'introduction',
          $type: 'input',
          label: '品牌介绍',
          $el: {
            type: 'textarea',
            placeholder: '请输入',
            rows: 3,
            // style: 'width:35%',
            // maxlength: 100,
            disabled,
          },
          rules: [
            {
              min: 0,
              max: 256,
              message: '请输入品牌介绍，最长不得超过256个字符',
              trigger: ['blur', 'change'],
            },
          ],
        },
      ],
    }
  },
  computed: {
    getId() {
      return this.$route.params.id
    },
    path() {
      return this.$route.name.split('-')[1]
    },
  },
  mounted() {
    if (this.path === 'detail' || this.path === 'edit') {
      this.updateEditForm(this.path)
    }
  },
  methods: {
    //发送
    saveFrom(params) {
      this.$refs.brandInfo.validate(valid => {
        if (!valid) return
        this.brandloading = true
        let getFormvalue = this.$refs.brandInfo.getFormValue()
        getFormvalue.enabled = Number(getFormvalue.enabled)
        this.confirmButtonLoading = true
        // 考虑合并promise内容
        if (this.getId) {
          putBrandManagement({id: this.getId, ...getFormvalue})
            .then(res => {
              this.$message.success('修改成功')
              this.$router.back()
            })
            .catch(err => {})
            .finally(() => {
              this.brandloading = false
              this.confirmButtonLoading = false
            })
        } else {
          postBrandManagement({...getFormvalue})
            .then(() => {
              this.$message.success('保存成功')
              this.$router.back()
            })
            .catch(() => {})
            .finally(() => {
              this.brandloading = false
              this.confirmButtonLoading = false
            })
        }
      })
    },
    updateEditForm(path) {
      this.title = path === 'edit' ? '编辑' : '详情'
      this.brandloading = true
      getBrandManagement({id: this.getId})
        .then(({payload}) => {
          this.$refs.brandInfo.value = Object.assign(
            {},
            this.$refs.brandInfo.value,
            payload,
          )
        })
        .catch(() => {})
        .finally(() => {
          this.brandloading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.brand-info {
  height: 100%;

  .cards-container {
    min-height: calc(100% - 60px);
    padding-bottom: 60px;

    .base-info {
      width: calc(460px + 130px);
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
