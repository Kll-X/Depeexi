<template>
  <div v-loading="loading" class="account-info-new">
    <panel title="账号信息" type="edit">
      <div class="account-info-form-container">
        <el-form-renderer
          ref="accountForm"
          :content="accountContent"
          label-width="100px"
        ></el-form-renderer>
      </div>
    </panel>
    <panel title="个人信息" type="edit">
      <div class="account-info-form-container">
        <el-form-renderer
          ref="personalForm"
          :content="personalContent"
          label-width="100px"
        ></el-form-renderer>
      </div>
    </panel>
    <div class="account-info-buttons">
      <el-button
        :disabled="loading"
        @click="$router.push('/member/account-info')"
        >取消</el-button
      >
      <el-button :loading="loading" type="primary" @click="handleSave"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import Panel from '^domain-member/components/panel'
import UploadToAli from '@femessage/upload-to-ali'
import ElSelectArea from '@femessage/el-select-area'
import {ENABLE_OPTIONS, SEX_OPTIONS} from '^domain-member/const/const'
import {
  phonePattern,
  emailPattern,
  qqPattern,
} from '^domain-member/const/pattern'
import {
  getMemberInfo,
  addMember,
  editMember,
} from '^domain-member/services/deepexi-system-digital-retail'

export default {
  components: {
    Panel,
  },
  data() {
    return {
      accountContent: [
        {
          type: 'input',
          id: 'username',
          label: '会员账号',
          el: {
            placeholder: '请输入',
          },
          rules: [{required: true, message: '请填写会员帐号', trigger: 'blur'}],
        },
        {
          type: 'input',
          id: 'phone',
          label: '手机号',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入手机号'))
                } else {
                  if (value && !phonePattern.test(value)) {
                    callback(new Error('请输入正确的手机号码格式'))
                  }
                  callback()
                }
              },
              trigger: ['change', 'blur'],
            },
          ],
        },
        {
          type: 'radio-group',
          id: 'status',
          label: '状态',
          options: Object.keys(ENABLE_OPTIONS)
            .reverse()
            .map(key => {
              return {
                label: ENABLE_OPTIONS[key],
                value: Number(key),
              }
            }),
          default: 1,
        },
        {
          type: 'input',
          id: 'nickName',
          label: '昵称',
          el: {
            placeholder: '请输入',
          },
        },
        {
          id: 'avatarUrl',
          label: '头像',
          el: {
            accept: 'image/png,image/jpg,image/jpeg',
            tip: '支持jpg/png格式，300k以内',
          },
          component: UploadToAli,
        },
      ],
      personalContent: [
        {
          type: 'input',
          id: 'name',
          label: '姓名',
          el: {
            placeholder: '请输入',
          },
        },
        {
          type: 'radio-group',
          id: 'sex',
          label: '性别',
          options: Object.keys(SEX_OPTIONS).map(key => {
            return {
              label: SEX_OPTIONS[key],
              value: Number(key),
            }
          }),
          default: 0,
        },
        {
          type: 'date-picker',
          id: 'birthday',
          label: '生日',
          el: {
            valueFormat: 'timestamp',
            placeholder: '请选择',
          },
        },
        {
          type: 'input',
          id: 'age',
          label: '年龄',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {
              validator: (rule, value, callback) => {
                // 年龄是1-120之间有效
                let reg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
                if (value && !reg.test(value)) {
                  callback(new Error('请输入正确的年龄格式'))
                }
                callback()
              },
              trigger: ['change', 'blur'],
            },
          ],
        },
        {
          type: 'input',
          id: 'job',
          label: '职业',
          el: {
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          id: 'email',
          label: '邮箱',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value && !emailPattern.test(value)) {
                  callback(new Error('请输入正确的邮箱格式'))
                }
                callback()
              },
              trigger: ['change', 'blur'],
            },
          ],
        },
        {
          type: 'input',
          id: 'qq',
          label: 'QQ',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value && !qqPattern.test(value)) {
                  callback(new Error('请输入正确的QQ格式'))
                }
                callback()
              },
              trigger: ['change', 'blur'],
            },
          ],
        },
        {
          label: '所在地区',
          id: 'inArea',
          type: 'input',
          component: ElSelectArea,
          default: [],
          inputFormat: val => {
            if (!val.inArea) return []
            return val.inArea.split(',')
          },
          outputFormat: val => {
            if (!val) return ''
            return val.join(',')
          },
        },
        {
          type: 'input',
          id: 'contactAddress',
          label: '详细地址',
          el: {
            type: 'textarea',
            placeholder: '请输入',
            rows: '4',
          },
        },
      ],
      loading: false,
    }
  },
  created() {
    // 判断是否为编辑
    if (!!this.$route.query.id) {
      this.handleGetAccountInfo()
    }
  },
  methods: {
    // 请求详情数据
    handleGetAccountInfo() {
      this.loading = true
      getMemberInfo(this.$route.query.id)
        .then(({payload}) => {
          this.handleUpdateFormData(payload)(
            this.$refs.accountForm,
            this.$refs.personalForm,
          )
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 更新form数据
    handleUpdateFormData(data) {
      return (...arg) => {
        arg.forEach(form => {
          if (
            typeof form !== null &&
            typeof form === 'object' &&
            form.updateForm
          ) {
            form.updateForm(data)
          }
        })
      }
    },
    // 校验全部form表单
    handleVaildateAll() {
      const forms = this.handleVaildateToPrimise(
        this.$refs.accountForm,
        this.$refs.personalForm,
      )
      return new Promise((resolve, reject) => {
        Promise.all(forms).then(valid => {
          resolve(valid.every(el => !!el))
        })
      })
    },
    // 将单个form表单嵌套Promise
    handleVaildateToPrimise(...arg) {
      return arg.reduce((pre, next) => {
        if (typeof next !== null && typeof next === 'object' && next.validate) {
          pre.push(
            new Promise(resolve => {
              next.validate(valid => {
                resolve(valid)
              })
            }),
          )
        }
        return pre
      }, [])
    },
    // 获取form表单数据
    handleGetFormValue(...arg) {
      return arg.reduce((pre, next) => {
        if (
          typeof next !== null &&
          typeof next === 'object' &&
          next.getFormValue
        ) {
          pre = {
            ...pre,
            ...next.getFormValue(),
          }
        }
        return pre
      }, {})
    },
    // 消息弹框
    showMessage(message, type = 'success') {
      this.$message({
        message,
        type,
      })
    },
    // 保存
    handleSave() {
      this.handleVaildateAll().then(vaild => {
        if (!vaild) return this.showMessage('请检查是否存在必填项', 'warning')
        const data = this.handleGetFormValue(
          this.$refs.accountForm,
          this.$refs.personalForm,
        )
        const id = this.$route.query.id
        // 判断新增还是编辑
        const currentSaveFn = id ? editMember : addMember
        this.loading = true
        currentSaveFn(data, id)
          .then(() => {
            this.showMessage('保存成功！')
          })
          .finally(() => {
            this.loading = false
            this.$router.push('/member/account-info')
          })
      })
    },
  },
}
</script>

<style lang="less">
.account-info {
  &-new {
    background-color: #fff;

    .upload-tip {
      font-size: 12px;
      color: #9ca6c7;
      margin-top: -16px;
    }
  }

  &-form-container {
    width: 560px;
    padding-left: 28px;

    .el-select-area {
      display: flex;

      :last-child {
        margin-right: 0;
      }
    }

    .el-form-item.is-success input.el-input__inner {
      border-color: #cad1e8;
    }

    .el-date-editor {
      width: 100%;
    }
  }

  &-buttons {
    height: 60px;
    line-height: 60px;
    margin: 0 -20px -20px;
    background-color: #f4f6fa;
    text-align: center;
  }
}
</style>
