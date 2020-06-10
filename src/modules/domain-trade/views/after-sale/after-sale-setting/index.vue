<template>
  <div class="orderSetting">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="orderSetting_ruleForm"
    >
      <!-- 客审设置 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_submit">
          <el-form-item class="orderSetting_checkBtn">
            <div class="orderSetting_submit_tit">
              <el-checkbox name="type"></el-checkbox>
              <div class="orderSetting_submit_tit orderSetting_label">
                开启自动审核，超过，
              </div>
              <el-input
                v-model="ruleForm.name3"
                :disabled="true"
                class="orderSetting_input"
                maxlength="3"
              ></el-input>
              <div class="orderSetting_submit_titR">
                天后未审核退货单，系统自动审核通过
              </div>
            </div>
          </el-form-item>

          <el-form-item class="orderSetting_checkBtn">
            <div class="orderSetting_submit_tit">
              <el-checkbox name="type"></el-checkbox>
              <div class="orderSetting_submit_tit orderSetting_label">
                开启自动取消退单，超过，
              </div>
              <el-input
                v-model="ruleForm.name3"
                :disabled="true"
                class="orderSetting_input"
                maxlength="3"
              ></el-input>
              <div class="orderSetting_submit_titR">
                天后会员未退货，系统自动取消退单
              </div>
            </div>
          </el-form-item>

          <el-form-item class="orderSetting_checkBtn">
            <div class="orderSetting_submit_tit">
              <el-checkbox name="type"></el-checkbox>
              <div class="orderSetting_submit_tit orderSetting_label">
                开启自动验货成功，超过，
              </div>
              <el-input
                v-model="ruleForm.name3"
                :disabled="true"
                class="orderSetting_input"
                maxlength="3"
              ></el-input>
              <div class="orderSetting_submit_titR">
                天后收到退货未验货，系统自动验货成功
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox name="type"></el-checkbox>
            <span class="orderSetting_label">
              开启自动退款，当退款单审核通过后，或退货退款单验货成功后，系统自动退款<span
                >（未开启时，需手动操作退款）</span
              >
            </span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="orderSetting_footer">
      <el-button type="primary" @click="submitForm('ruleForm')"
        >立即创建</el-button
      >
      <el-button @click="resetForm('ruleForm')">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSetting',
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'},
        ],
        region: [
          {required: true, message: '请选择活动区域', trigger: 'change'},
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          {required: true, message: '请选择活动资源', trigger: 'change'},
        ],
        desc: [{required: true, message: '请填写活动形式', trigger: 'blur'}],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style scoped lang="less">
.marginLeft10 {
  margin-left: 10px;
}

.commonCont {
  padding: 10px;
  background: #fff;
  border-radius: 10px;
}

.orderSetting {
  background: #f0f2f5;
  min-height: 755px;
  overflow: auto;

  &_ruleForm {
    margin-bottom: 80px;
  }

  &_submit {
    display: flex;
    flex-direction: column;

    &_tit {
      display: flex;
    }

    &_titR {
      .marginLeft10;
    }
  }

  &_cont {
    margin-bottom: 10px;
    .commonCont;
  }

  &_input {
    width: 80px;
    max-width: 80px;
  }

  &_checkBtn {
    display: flex;
  }

  &_label {
    margin-left: 10px;
  }

  &_footer {
    text-align: center;
    margin-top: 30px;
    height: 60px;
    line-height: 60px;
    background: #f4f6fa;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 99;
  }
}
</style>
