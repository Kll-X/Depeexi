<!-- 添加并编辑属性 -->
<template>
  <div v-loading="loadingDetail" class="add-property-wrap">
    <div class="cards-container">
      <form-card :title="`${title}属性`">
        <el-form
          ref="formDetail"
          :model="propertyForm"
          :rules="propertyRules"
          label-width="100px"
          class="base-info"
        >
          <el-form-item label="属性编码" prop="propertyCode">
            <!--  maxlength="32" -->
            <el-input
              v-model="propertyForm.propertyCode"
              :disabled="disabled"
              placeholder="请输入"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="属性名称" prop="propertyName">
            <el-input
              v-model="propertyForm.propertyName"
              :disabled="disabled"
              placeholder="请输入"
              :clearable="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="输入方式" prop="inputType">
            <el-radio-group
              v-model="propertyForm.inputType"
              :disabled="disabled"
            >
              <el-radio
                v-for="(item, index) in INPUT_TYPE"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- 枚举情况下才有 -->
          <el-form-item
            v-if="propertyForm.inputType === 1"
            label="属性值"
            prop="propertyValue"
          >
            <input-table
              v-model="propertyForm.propertyValue"
              :disabled="disabled"
            ></input-table>
          </el-form-item>
          <!-- 属性状态，保留 -->
          <!-- <el-form-item label="状态" prop="status">
            <el-radio-group v-model="propertyForm.status" :disabled="disabled">
              <el-radio
                v-for="(item, index) in STATUS_OPTIONS__PROPERTY"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>-->
        </el-form>
      </form-card>
    </div>
    <div class="buttons_group">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        :loading="confirmButtonLoading"
        type="primary"
        @click="submitForm"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import InputTable from './components/input-table/index.vue'
import FormCard from '^domain-goods/components/form-card'
import {
  INPUT_TYPE,
  STATUS_OPTIONS__PROPERTY,
} from '^domain-goods/const/dictionary.js'
import {
  postCommodityPropertys,
  putCommodityPropertys,
  getCommodityPropertysDetail,
} from '^domain-goods/services/commodity-center.js'
import {noneChinesePattern} from '^domain-goods/const/pattern'

export default {
  components: {
    InputTable,
    FormCard,
  },
  data() {
    var checkProps = (rule, value = [], callback) => {
      if (!value || value.length === 0) {
        return callback(new Error('请输入最少一条的属性值'))
      }
      let flag = false // 判断有无空值
      value.forEach(item => {
        if (!item.propertyValue) {
          flag = true
          return
        }
      })
      if (flag) {
        // 有空值就报错
        return callback(new Error('属性值不能为空'))
      }
      callback()
    }
    return {
      title: '新增',
      confirmButtonLoading: false,
      INPUT_TYPE, // 输入
      STATUS_OPTIONS__PROPERTY, // 状态
      loadingDetail: false, // 是否在请求详情信息
      propertyRules: {
        propertyCode: [
          {required: true, message: '请输入属性编码', trigger: 'blur'},
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
        propertyName: [
          {required: true, message: '请输入属性名称', trigger: 'blur'},
          {
            min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
        ],
        propertyValue: [
          // todo， 需要自定义校验
          {validator: checkProps, trigger: ['blur', 'change']},
          {
            required: true,
            message: '请输入最少一条的属性值',
            trigger: ['blur', 'change'],
          },
        ],
      }, // 输入框的值校验
      propertyForm: {
        propertyCode: '', // 属性编码
        propertyName: '', // 属性名称
        inputType: 1, // 默认选中枚举选择
        propertyValue: [{propertyValue: ''}], // 属性值数组eg: [{propertyValue:'1'}]
        status: 1,
      },
      disabled: false,
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
    // 编辑或者查看时需要进行填充数据
    this.getId && this.fetchPropertyDetail(this.getId)
  },
  methods: {
    // 取消，清空表单
    handleCancel() {
      this.$router.back()
    },
    // 确定
    submitForm() {
      this.$refs.formDetail.validate(valid => {
        if (valid) {
          const {
            propertyCode, // 属性编码
            propertyName, // 属性名称
            inputType, // 默认选中枚举选择
            propertyValue,
            status, // 状态
          } = this.propertyForm
          const formatValue = {
            propertyCode,
            propertyName,
            inputType,
            propertyValue: [],
            status,
            parentId: 0, // 默认传0，代表根路径
          }
          if (inputType === 1) {
            // 仅在属性类型为枚举时，进行属性值数据填充
            formatValue.propertyValue = propertyValue
              .filter(v => v.propertyValue)
              .map(v => {
                this.getId && (v.propertyId = this.getId)
                return v
              })
          }
          const propertyId = this.getId
          this.confirmButtonLoading = true
          // 判断当前是编辑还是新增, 可以考虑一下合并promise的代码
          if (!!propertyId) {
            // 编辑
            putCommodityPropertys({...formatValue, id: propertyId})
              .then(res => {
                this.$message.success('修改属性成功')
                // 返回上一页
                this.handleCancel()
              })
              .finally(() => {
                this.confirmButtonLoading = false
              })
          } else {
            // 新增
            postCommodityPropertys(formatValue)
              .then(() => {
                this.$message.success('添加属性成功')
                // 返回上一页
                this.handleCancel()
                // this.$refs.formDetail.resetFields()
              })
              .finally(() => {
                this.confirmButtonLoading = false
              })
          }
        } else {
          this.$message({
            showClose: true,
            message: '请填写完整信息',
            type: 'warning',
          })
          return false
        }
      })
    },
    // 请求编辑详情数据
    fetchPropertyDetail(id) {
      this.loadingDetail = true
      this.disabled = this.path === 'edit' ? false : true
      this.title = this.path === 'edit' ? '修改' : '详情'
      getCommodityPropertysDetail({id})
        .then(({payload}) => {
          const {propertyCode, propertyName, inputType, propertyValue, status} =
            payload || {}
          this.propertyForm = {
            propertyCode, // 属性编码
            propertyName, // 属性名称
            inputType, // 默认选中枚举选择
            propertyValue: (propertyValue || []).map(v => {
              return {
                propertyValue: v.propertyValue,
                appId: v.appId,
                id: v.id,
                propertyId: v.propertyId,
                tenantId: v.tenantId,
              }
            }), // 属性值数组eg: [1,2]
            status, // 状态
          }
        })
        .finally(() => {
          this.loadingDetail = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.add-property-wrap {
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
