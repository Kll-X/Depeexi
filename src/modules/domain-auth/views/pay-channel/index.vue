<template>
  <div class="pay-channel">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="pay-channel__item">
          <p class="pay-channel__item__type">
            <span class="flex-center">
              <img src="../../image/alipay.svg" />
              <span>支付宝</span>
            </span>
            <el-button @click="alipay.isShow = true">设置账户</el-button>
          </p>
          <p class="pay-channel__item__desc">
            需开通企业支付宝账号，仅支持以企业对公账户作为收款账户。交易手续费由支付宝公司向收款方收取。
          </p>
          <p class="pay-channel__item__status">
            <a
              href="https://open.alipay.com/developmentDocument.htm"
              target="_blank"
              >开通指引</a
            >
            <span>{{ alipay.openStatus | formatIsOpen }}</span>
          </p>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="pay-channel__item">
          <p class="pay-channel__item__type">
            <span class="flex-center">
              <img src="../../image/weixin.svg" />
              <span>微信支付</span>
            </span>
            <el-button @click="wetchat.isShow = true">设置账户</el-button>
          </p>
          <p class="pay-channel__item__desc">
            需您开通微信服务号，并与腾讯公司签约收款服务；交易手续费由腾讯公司向收款方收取。
          </p>
          <p class="pay-channel__item__status">
            <a
              href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F"
              target="_blank"
              >开通指引</a
            >
            <span>{{ wetchat.openStatus | formatIsOpen }}</span>
          </p>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="wetchat.isShow" title="设置微信支付账号">
      <el-form-renderer
        ref="wetchat"
        :content="wetchat.form"
        label-width="120px"
      ></el-form-renderer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="wetchat.isShow = false">取 消</el-button>
        <el-button :loading="wetchat.loading" type="primary" @click="saveWechat"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog :visible.sync="alipay.isShow" title="设置支付宝支付账号">
      <el-form-renderer
        ref="alipay"
        :content="alipay.form"
        label-width="120px"
      ></el-form-renderer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alipay.isShow = false">取 消</el-button>
        <el-button :loading="alipay.loading" type="primary" @click="saveAlipay"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {setPayment} from '../../services/payment'

export default {
  filters: {
    formatIsOpen(status) {
      return {
        0: '未开通',
        1: '已启用',
      }[status]
    },
  },
  data() {
    return {
      wetchat: {
        isShow: false,
        loading: false,
        openStatus: 0,
        form: [
          {
            $id: 'id',
            $attrs: {},
            $el: {
              placeholder: '获取路径：公众平台-开发-基本配置',
            },
            $type: 'input',
            label: '开发者ID',
            rules: [
              {
                required: true,
                message: '请输入开发者ID',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'mm',
            $attrs: {},
            $el: {
              placeholder: '获取路径：公众平台-开发-基本配置',
            },
            $type: 'input',
            label: '开发者密码',
            rules: [
              {
                required: true,
                message: '请输入开发者密码',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'sh',
            $attrs: {},
            $el: {
              placeholder: '获取路径：商户平台-账户中心-商户信息',
            },
            $type: 'input',
            label: '商户号',
            rules: [
              {
                required: true,
                message: '请输入商户号',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'my',
            $attrs: {},
            $el: {
              placeholder: '获取路径：商户平台-账户中心-API安全-API密钥',
            },
            $type: 'input',
            label: 'API密钥',
            rules: [
              {
                required: true,
                message: '请输入API密钥',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'status',
            $attrs: {},
            $el: {},
            $type: 'radio-group',
            label: '状态',
            $default: '0',
            $options: [
              {label: '禁用', value: '0'},
              {label: '启用', value: '1'},
            ],
          },
        ],
      },
      alipay: {
        isShow: false,
        loading: false,
        openStatus: 1,
        form: [
          {
            $id: 'acc',
            $attrs: {},
            $el: {},
            $type: 'input',
            label: '支付宝企业账号',
            rules: [
              {
                required: true,
                message: '请输入支付宝企业账号',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'sf',
            $attrs: {},
            $el: {},
            $type: 'input',
            label: '合作者身份',
            rules: [
              {
                required: true,
                message: '请输入合作者身份',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'mm',
            $attrs: {},
            $el: {},
            $type: 'input',
            label: 'MD5密钥',
            rules: [
              {
                required: true,
                message: '请输入MD5密钥',
                trigger: ['blur', 'change'],
              },
            ],
          },
          {
            $id: 'status',
            $attrs: {},
            $el: {},
            $type: 'radio-group',
            label: '状态',
            $default: '0',
            $options: [
              {label: '禁用', value: '0'},
              {label: '启用', value: '1'},
            ],
          },
        ],
      },
    }
  },
  methods: {
    saveWechat() {
      let formData = this.$refs.wetchat.getFormValue()
      this.$refs.wetchat.validate(valid => {
        if (!valid) return

        this.wetchat.loading = true

        setPayment(formData).finally(() => {
          this.wetchat.loading = false
          this.wetchat.isShow = false
          this.$message.success('保存成功')
        })
      })
    },
    saveAlipay() {
      let formData = this.$refs.alipay.getFormValue()

      this.$refs.alipay.validate(valid => {
        if (!valid) return

        this.alipay.loading = true

        setPayment(formData).finally(() => {
          this.alipay.loading = false
          this.alipay.isShow = false
          this.$message.success('保存成功')
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pay-channel {
  padding: 15px;

  &__item {
    &__type {
      .flex-between;

      img {
        width: 40px;
        height: 40px;
        margin-right: 6px;
      }
    }

    &__desc {
      margin: 15px 0;
      height: 60px;
    }

    &__status {
      .flex-between;

      a {
        text-decoration: underline;
      }
    }
  }
}
</style>
