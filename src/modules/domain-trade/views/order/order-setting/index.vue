<template>
  <div class="orderSetting">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="orderSetting_ruleForm"
    >
      <!-- 提交订单 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_cont_head">
          <div class="orderSetting_cont_head_tit">提交订单</div>
        </div>
        <el-form-item label="" prop="name">
          <div class="orderSetting_submit">
            <div class="orderSetting_submit_tit">
              提交订单后，
            </div>
            <el-input
              v-model="ruleForm.name1"
              class="orderSetting_input"
              maxlength="5"
            ></el-input>
            <div class="orderSetting_submit_titR">
              分钟后未支付，自动取消订单
            </div>
          </div>
        </el-form-item>
      </div>
      <!-- 客审设置 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_cont_head">
          <div class="orderSetting_cont_head_tit">客审设置</div>
        </div>
        <el-form-item label="" prop="name2">
          <div class="orderSetting_submit">
            <div class="orderSetting_submit_tit">
              <div class="orderSetting_checkBtn">
                <el-checkbox name="type"></el-checkbox>
                <div class="orderSetting_submit_tit orderSetting_label">
                  自动审核，
                </div>
                <el-input
                  v-model="ruleForm.name3"
                  :disabled="true"
                  class="orderSetting_input"
                  maxlength="5"
                ></el-input>
                <div class="orderSetting_submit_titR">
                  小时后未审核，系统自动完成审核
                </div>
              </div>
              <el-checkbox name="type"></el-checkbox
              ><span class="orderSetting_label"
                >允许改价，会员提交订单（但未支付），运营人员修改订单价格后再支付</span
              >
            </div>
          </div>
        </el-form-item>
      </div>
      <!-- 客审设置 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_cont_head">
          <div class="orderSetting_cont_head_tit">配货设置</div>
        </div>
        <el-form-item label="" prop="name2">
          <div class="orderSetting_submit">
            <div class="orderSetting_submit_tit">
              <div class="orderSetting_checkBtn">
                <el-checkbox name="type"></el-checkbox>
                <div class="orderSetting_submit_tit orderSetting_label">
                  开启自动配货，订单审核，
                </div>
                <el-input
                  v-model="ruleForm.name4"
                  :disabled="true"
                  class="orderSetting_input"
                  maxlength="5"
                ></el-input>
                <div class="orderSetting_submit_titR">
                  分钟后，系统进行自动配货
                </div>
              </div>
              <!-- 自动配货配置项 -->
              <div v-show="ruleForm.name13" class="orderSetting_hideCont">
                <el-form-item style="margin-bottom:0;">
                  <el-checkbox name="type"></el-checkbox>
                  <span class="orderSetting_label">
                    商品库存为0时，不允许配货
                  </span>
                </el-form-item>
              </div>
              <div>
                <el-checkbox name="type"></el-checkbox>
                <span class="orderSetting_label">
                  开启拆单策略（拆单后会形成一个或多个发货包裹，未开启时默认整单配货）
                </span>
              </div>
              <!-- 拆单策略配置项 -->
              <div v-show="ruleForm.name14" class="orderSetting_hideCont">
                <el-form-item style="margin-bottom:0;">
                  <div class="orderSetting_checkBtn">
                    <el-checkbox name="type"></el-checkbox>
                    <div class="orderSetting_submit_tit orderSetting_label">
                      支付金额超过，
                    </div>
                    <el-input
                      v-model="ruleForm.name5"
                      :disabled="true"
                      class="orderSetting_input"
                      maxlength="5"
                    ></el-input>
                    <div class="orderSetting_submit_titR">
                      元拆单
                    </div>
                  </div>
                </el-form-item>
                <el-form-item style="margin-bottom:0; margin-top:10px;">
                  <div class="orderSetting_checkBtn">
                    <el-checkbox name="type"></el-checkbox>
                    <div class="orderSetting_submit_tit orderSetting_label">
                      订单仓库为，
                    </div>
                    <el-input
                      v-model="ruleForm.name6"
                      :disabled="true"
                      class="orderSetting_input"
                      maxlength="5"
                    ></el-input>
                    <div class="orderSetting_submit_titR">
                      时不拆单
                    </div>
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 财审设置 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_cont_head">
          <div class="orderSetting_cont_head_tit">财审设置</div>
        </div>
        <el-form-item label="" prop="name">
          <div class="orderSetting_submit">
            <div class="orderSetting_submit_tit">
              <el-checkbox name="type"></el-checkbox
              ><span class="orderSetting_label">开启自动财审，</span>
            </div>
            <el-input
              v-model="ruleForm.name"
              :disabled="true"
              class="orderSetting_input"
              maxlength="5"
            ></el-input>
            <div class="orderSetting_submit_titR">
              分钟未审核，系统自动完成审核
            </div>
          </div>
        </el-form-item>
      </div>
      <!-- 发货收货设置 -->
      <div class="orderSetting_cont">
        <div class="orderSetting_cont_head">
          <div class="orderSetting_cont_head_tit">发货收货设置</div>
        </div>
        <el-form-item label="" prop="name">
          <div class="orderSetting_submit">
            <div class="orderSetting_submit_tit">
              开启自动收货，
            </div>
            <el-input
              v-model="ruleForm.name"
              class="orderSetting_input"
              maxlength="3"
            ></el-input>
            <div class="orderSetting_submit_titR">
              天后未确认收货，系统自动确认收货
            </div>
          </div>
        </el-form-item>
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

  &_head {
    margin-bottom: 10px;
    margin-left: 10px;

    &_tit {
      position: relative;

      &::before {
        content: '';
        width: 3px;
        height: 11px;
        left: -7px;
        top: 50%;
        transform: translate(0, -50%);
        border-radius: 25px;
        background: #e2e2e2;
        position: absolute;
      }
    }
  }
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
  }

  &_checkBtn {
    display: flex;
  }

  &_label {
    margin-left: 10px;
  }

  &_hideCont {
    margin-left: 30px;
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
