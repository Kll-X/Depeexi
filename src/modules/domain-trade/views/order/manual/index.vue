<template>
  <div class="manual">
    <div class="manualStep">
      <el-steps :active="step" finish-status="finish" simple class="steps-bar">
        <el-step
          v-for="(item, index) in stepLabels"
          :key="index"
          :title="item.title"
        >
          <div slot="icon">{{ index + 1 }}</div>
        </el-step>
      </el-steps>
    </div>
    <div v-show="step === 1">
      <div>
        <el-button
          type="primary"
          class="setBorRadius selectGoods"
          size="mini"
          @click="selectGoods"
          >选择商品</el-button
        >
      </div>
      <el-data-table ref="dataTable" v-bind="goodsConfig" class="goodTable">
        <el-table-column label="购买数量">
          <template slot="default" slot-scope="scope">
            <el-input
              v-model="scope.row.skuQty"
              maxlength="7"
              placeholder="请输入"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot="default" slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="delFontCol"
              @click="delGoods(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-data-table>
      <div v-if="hasGoods" class="operate-group">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="nextBtn">下一步</el-button>
      </div>
    </div>
    <div v-show="step === 2">
      <p class="title">订单来源</p>
      <div class="flex-box">
        <el-form-renderer ref="order" :content="order" label-width="100px" />
      </div>
      <p class="title">收货地址</p>
      <div class="flex-box">
        <el-form-renderer
          ref="contact"
          :content="contact"
          label-width="100px"
        />
      </div>
      <p class="title">发票信息</p>
      <div class="flex-box">
        <el-form-renderer
          ref="information"
          :content="information"
          label-width="100px"
        />
      </div>
      <p class="title">支付信息</p>
      <div class="flex-box setPay">
        <el-form-renderer
          ref="payment"
          :content="payment"
          label-width="100px"
        />
      </div>
      <div class="operate-group">
        <el-button class="setBorRadius" @click="preStepBtn">上一步</el-button>
        <el-button class="setBorRadius" @click="handleCancel">取消</el-button>
        <el-button type="primary" class="setBorRadius" @click="sendData"
          >提交</el-button
        >
      </div>
    </div>
    <div v-show="step === 3">
      <div class="finish-dialog">
        <div class="finish-dialog_img">
          <img src="../../../assets/img/success.png" />
        </div>
        <p class="succ_tipl">恭喜你，订单提交成功</p>
        <div class="succ_btn">
          <el-button class="setBorRadius" @click="backList">返回列表</el-button>
          <el-button type="primary" class="setBorRadius" @click="reset"
            >继续创建</el-button
          >
        </div>
      </div>
    </div>
    <el-drawer
      :visible.sync="itemsConfig.goodsFormVisible"
      size="50%"
      direction="rtl"
      title="选择商品"
      @close="itemsConfig.closeGoodsFormDialog"
    >
      <div class="goodsScroll">
        <el-radio-group
          v-model="activeName"
          text-color="#5D81F9"
          type="card"
          class="drawerTable tab-group"
        >
          <el-radio-button label="0">标准商品</el-radio-button>
        </el-radio-group>
        <div class="selectFont">
          当前已选择<span>{{ selected.length }}</span
          >项
        </div>
        <el-data-table
          ref="goodsDataTable"
          v-bind="goodsListConfig"
          class="drawerTable"
          @update="goodsUpdate"
          @selection-change="goodsListConfig.onSelectionChange"
        />
      </div>
      <div class="dialog-footer">
        <el-button @click="itemsConfig.closeGoodsFormDialog">取 消</el-button>
        <el-button type="primary" @click="itemsConfig.goodsFormSendFormBtn"
          >确认</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {Steps, Step} from 'element-ui'
import UploadToAli from '@femessage/upload-to-ali'
import {
  // getChannel, //暂时屏蔽
  postSaleOrderManual,
  getCommodityList,
} from '~/modules/domain-trade/services/v1/domain-trade-api'
import {PAY_TYPE} from '~/modules/domain-trade/const/const'
import {phonePattern, amountPattern} from '~/const/pattern'
import {RadioGroup, RadioButton} from 'element-ui'

const rendererList = ['order', 'contact', 'information', 'payment']

export default {
  components: {
    ElSteps: Steps,
    ElStep: Step,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  inject: ['reload'],
  data() {
    return {
      step: 1,
      hasGoods: false,
      activeName: '0',
      shellId: '',
      stepLabels: [
        {
          id: 0,
          title: '选购商品',
        },
        {
          id: 1,
          title: '填写订单信息',
        },
        {
          id: 2,
          title: '完成',
        },
      ],
      itemsConfig: {
        goodsFormVisible: false,
        closeGoodsFormDialog: () => {
          this.selected = []
          this.$nextTick(() => {
            this.$refs.goodsDataTable.clearSelection()
            this.itemsConfig.goodsFormVisible = false
          })
        },
        goodsFormSendFormBtn: () => {
          this.$nextTick(() => {
            this.$refs.dataTable.data = this.selected
          })
          this.itemsConfig.goodsFormVisible = false
        },
      },
      selected: [], //选中的商品
      goodsListConfig: {
        url: getCommodityList,
        hasOperation: false,
        persistSelection: true,
        hasPagination: true,
        hasEdit: false,
        hasNew: false,
        hasDelete: false,
        columns: [
          {type: 'selection'},
          {
            prop: 'skuCode',
            label: '商品编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuName',
            label: '商品名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuId',
            label: '商品SKU编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuPrice',
            label: '价格',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
        onSelectionChange: val => {
          this.selected = val
          if (val.length) {
            this.hasGoods = true
          }
        },
      },
      goodsConfig: {
        hasNew: false,
        hasPagination: false,
        hasOperation: false,
        columns: [
          {
            prop: 'skuCode',
            label: '商品编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuName',
            label: '商品名称',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuId',
            label: 'SKU编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuPrice',
            label: '价格',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          // todo 产品说了未作功能不显示
          // {
          //   prop: 'unit',
          //   label: '单位',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'weight',
          //   label: '重量(kg)',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'bulk',
          //   label: '体积(m2)',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
        ],
      },
      order: [
        {
          type: 'select',
          id: 'sourceChannel',
          label: '来源渠道',
          el: {
            style: 'width: 460px',
          },
          rules: [{required: true, message: '请输入', trigger: 'change'}],
        },
        {
          type: 'input',
          id: 'sellerName',
          label: '来源店铺',
          default: 'DEEPEXI数字化零售平台',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
            disabled: true,
          },
        },
      ],
      contact: [
        {
          type: 'input',
          id: 'consignee',
          label: '收货人',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          rules: [{required: true, message: '请输入', trigger: 'change'}],
        },
        {
          type: 'input',
          id: 'mobile',
          label: '联系电话',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          rules: [
            {
              pattern: phonePattern,
              trigger: 'change',
              message: '请输入正确手机',
            },
            {required: true, message: '请输入', trigger: 'change'},
          ],
        },
        {
          id: 'area',
          type: 'select-area',
          label: '省/市/区',
          default: [],
          el: {
            placeholders: ['请选择', '请选择', '请选择'],
            type: 'code',
            style: 'width: 470px',
          },
          rules: [
            {
              type: 'array',
              message: '请选择区域',
              trigger: 'blur',
            },
            {required: true, message: '请选择', trigger: 'change'},
          ],
        },
        {
          type: 'input',
          id: 'streetName',
          label: '街道',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          rules: [{required: true, message: '请输入', trigger: 'change'}],
        },
        {
          type: 'input',
          id: 'address',
          label: '详细地址',
          el: {
            type: 'textarea',
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          rules: [{required: true, message: '请输入', trigger: 'change'}],
        },
      ],
      information: [
        {
          type: 'radio-group',
          id: 'needInvoice',
          label: '是否需要发票',
          default: 0,
          options: ['否', '是'].map((label, index) => ({
            label,
            value: index,
          })),
        },
        {
          type: 'radio-group',
          id: 'titleType',
          label: '抬头类型',
          default: 1,
          options: ['个人', '企业'].map((label, index) => ({
            label,
            value: index + 1,
          })),
          hidden: form => !form.needInvoice,
        },
        {
          type: 'radio-group',
          id: 'type',
          label: '发票类型',
          default: 1,
          options: ['普通发票', '增值税专用发票'].map((label, index) => ({
            label,
            value: index + 1,
          })),
          hidden: form => !form.needInvoice,
        },
        {
          type: 'input',
          id: 'title',
          label: '发票抬头',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          hidden: form => !form.needInvoice,
        },
        {
          type: 'input',
          id: 'number',
          label: '识别号',
          el: {
            placeholder: '请输入',
            class: 'setMaxWidth',
          },
          hidden: form => !form.needInvoice,
        },
      ],
      payment: [
        {
          type: 'input',
          id: 'originalTotalAmount',
          label: '订单金额(￥)',
          el: {
            placeholder: '= 商品销售价格 * 购买数量',
            class: 'setMaxWidth',
            type: 'number',
          },
          rules: [
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          type: 'input',
          id: 'changeAmount',
          label: '优惠金额(￥)',
          el: {
            placeholder: '请输入',
            type: 'number',
            class: 'setMaxWidth',
          },
          rules: [
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          type: 'input',
          id: 'freight',
          label: '运费(￥)',
          el: {
            placeholder: '请输入',
            type: 'number',
            class: 'setMaxWidth',
          },
          rules: [
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          type: 'input',
          id: 'payableAmount',
          label: '应付金额(￥)',
          el: {
            placeholder: '= 订单金额 + 运费 - 优惠金额',
            type: 'number',
            class: 'setMaxWidth',
          },
          rules: [
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          type: 'input',
          id: 'realPayAmount',
          label: '实付金额(￥)',
          el: {
            placeholder: '请输入',
            type: 'number',
            class: 'setMaxWidth',
          },
          rules: [
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          type: 'radio-group',
          id: 'payType',
          label: '支付方式',
          options: PAY_TYPE,
          rules: [{required: true, message: '请选择', trigger: 'change'}],
        },
        {
          id: 'payPicPath',
          component: UploadToAli,
          label: '支付截图',
          el: {
            multiple: true,
            max: 3,
          },
        },
      ],
    }
  },
  created() {
    // ! 获取渠道选择框数据
    // getChannel().then(({payload: channelList}) => {
    this.$nextTick(() => {
      let channelList = [
        {
          id: null,
          tenantId: null,
          appId: null,
          createdBy: null,
          createdTime: null,
          updatedBy: null,
          updatedTime: null,
          channelId: '123',
          channelCode: 'h5001',
          channelName: '移动商城',
          sellerId: '10020',
          sellerName: '1号卖家',
          status: 1,
        },
      ]
      const searchFromDOM = this.$refs.order
      if (searchFromDOM) {
        searchFromDOM.setOptions(
          'sourceChannel',
          channelList.map(v => ({
            label: v.channelName,
            value: v.channelId,
            ...v,
          })),
        )
      }
    })
    // })
  },
  methods: {
    selectGoods() {
      this.itemsConfig.goodsFormVisible = true
    },
    nextBtn() {
      const isHasQty = this.$refs.dataTable.data.every(
        v => v.skuQty && Number(v.skuQty) > 0,
      )
      if (!isHasQty) {
        this.$message.warning('请填写购买数量')
        return false
      }
      this.step += 1
    },
    validForm(form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(valid => {
          if (!valid) {
            reject()
          }
          resolve()
        })
      })
    },
    reduceData(list) {
      return list
        .map(form => this.$refs[form].getFormValue())
        .reduce(
          (cons, item) => ({
            ...item,
            ...cons,
          }),
          {},
        )
    },
    sendData() {
      // body
      const saleOrderSourceInfo = this.reduceData(['order']) // 订单来源
      const saleOrderDelivery = this.reduceData(['contact']) // 收货地址
      const saleOrderInvoice = this.reduceData(['information']) // 发票信息
      const paymentDetail = this.reduceData(['payment']) //支付信息
      const [provinceCode, cityCode, areaCode] = saleOrderDelivery.area
      const params = {
        saleOrderDelivery: {
          ...saleOrderDelivery,
          provinceCode,
          cityCode,
          areaCode,
        },
        saleOrderItems: this.$refs.dataTable.data.map(v => {
          this.shellId = v.shopId
          return {
            ...v,
            sellerId: v.shopId,
            skuVersion: v.releaseVersion,
          }
        }),
        saleOrderSourceInfo: {
          ...saleOrderSourceInfo,
          sellerId: this.shellId,
        },
        saleOrderInvoice,
        paymentDetail: {
          ...paymentDetail,
          payPicPath: String(
            paymentDetail.payPicPath ? paymentDetail.payPicPath : '',
          ),
        },
      }
      this.$refs.contact.validate(valid => {
        if (valid) {
          this.$refs.payment.validate(valid => {
            if (valid) {
              postSaleOrderManual(params).then(({code}) => {
                if (parseInt(code, 10) === 0) {
                  this.step = 3
                }
              })
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    goodsUpdate(data) {
      this.$refs.goodsDataTable.data = data.map(v => ({
        ...v,
        skuCode: v.itemWholeDTO && v.itemWholeDTO.code,
        skuName: v.itemWholeDTO && v.itemWholeDTO.name,
        skuId: v.skuDTO && v.skuDTO.id,
        skuPrice: v.skuDTO && v.skuDTO.price,
        // todo 后端没字段，前端写死（产品说了未作功能先不显示）
        // unit: '未知',
        // weight: '60',
        // bulk: '1960',
      }))
    },
    delGoods(row) {
      const tableData = this.$refs.dataTable.data
      this.$refs.dataTable.data = tableData.filter(v => v.id !== row.id)
      if (this.$refs.dataTable.data.length == 0) {
        this.hasGoods = false
      }
    },
    reset() {
      this.step = 1
      this.reload()
    },
    handleCancel() {
      this.$router.replace('/order')
    },
    backList() {
      this.$router.replace('/order')
    },
    preStepBtn() {
      this.step -= 1
    },
  },
}
</script>

<style lang="less">
@import url('../../../style/mixins.less');
@import '~^domain-goods/styles/var.less';

.manual {
  padding: 16px 16px 0 16px;

  .title {
    margin: 16px 0;
    position: relative;
    padding-left: 16px;
    font-size: 14px;
    color: #2d303b;

    &::before {
      content: '';
      position: absolute;
      top: 15%;
      left: 9px;
      height: 75%;
      width: 3px;
      border-radius: 3px;
      background-color: #575962;
    }
  }
}

.flex-box {
  display: flex;
  justify-content: space-between;
  padding: 0 582px 0 40px;
  min-width: 1024px;

  > form {
    flex: 1;
    margin: 0 16px;
  }
}

.finish-dialog {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &_img {
    width: 119px;
    height: 120px;
    margin-bottom: 24px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.operate-group {
  text-align: center;
  margin-top: 30px;
  height: 60px;
  line-height: 60px;
  background: #f4f6fa;
  margin-left: -16px;
  margin-right: -16px;
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 99;
}

.goodTable {
  max-height: 570px;
  overflow: auto;
  height: 570px;
}

.delFontCol {
  color: #f56c6c;
}

.manualStep {
  padding: 30px 225px 0;
}

.drawerTable {
  width: 100%;
  padding: 0 20px;
}

.dialog-footer {
  position: absolute;
  bottom: 0;
  background: #f4f6fa;
  width: 100%;
  text-align: center;
  display: flex;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  z-index: 99;
}

& .tab-group {
  .btnColor;
}

.selectFont {
  font-size: 12px;

  span {
    color: #2878ff;
    padding: 0 4px;
  }

  padding: 0 20px 15px 20px;
}

.goodsScroll {
  padding-bottom: 200px;
  padding-right: 40px;
}

.steps-bar {
  margin: 0 auto;
  max-width: 1024px;
}

.el-step.is-simple {
  .el-step__title {
    font-size: 14px;
    font-weight: 400;
  }

  .is-process {
    color: #9ca6c7;
    border: #9ca6c7;
  }

  .is-finish {
    color: @color__success;
    border: @color__success;
  }

  .el-step__icon {
    width: 24px;
    height: 24px;
    font-size: 14px;
    font-weight: 500;
    border-width: 1px;
  }
}

.setMaxWidth {
  width: 460px;
  max-width: 460px;
}

.succ_btn {
  margin-top: 30px;
}

.succ_tipl {
  font-size: 14px;
  color: #2d303b;
  font-weight: 400;
}

.setBorRadius {
  border-radius: 4px;
}

.selectGoods {
  margin-bottom: 20px;
  margin-top: 40px;
}

.setPay {
  padding-bottom: 100px;
}
</style>
