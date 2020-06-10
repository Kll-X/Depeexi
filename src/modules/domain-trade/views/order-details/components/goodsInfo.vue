<template>
  <div class="goodsInfo">
    <div v-if="Object.keys(orderStautsObj).length" class="goodsInfo_Info">
      <div class="goodsInfo-head">
        <svg-icon :icon-class="orderStautsObj.infoIcon" class="svg-FontSize" />
        <div :class="['goodsInfo-head-font', isOderSale ? 'ccc' : 'blue']">
          {{ orderStautsObj.label }}
        </div>
      </div>
      <div class="goodsInfo-cont">
        {{ orderStautsObj.contLable }}
      </div>
      <div v-if="isHasOrderBtn" class="goodsInfo-foot">
        <div v-for="(item, index) of orderBtnList" :key="index">
          <el-button
            v-if="isShowCancelBtn(item)"
            :type="item.type"
            size="small"
            class="btnPadLeft"
            @click="orderBtn(item.func, item.param)"
            >{{ item.name }}</el-button
          >
        </div>
      </div>
    </div>
    <div v-else>
      暂无数据
    </div>
    <!-- 确认配货弹窗 -->
    <el-drawer
      :visible.sync="distributionFormVisible"
      title="确认配货"
      size="60%"
      direction="rtl"
      @close="closeDistributionFormDialog"
    >
      <el-data-table
        ref="distributionForm"
        v-bind="distributionTable"
        :url="distributionUrl"
        class="drawerTable"
      >
        <el-table-column label="配货数" width="200">
          <template slot="default" slot-scope="scope">
            <el-input
              v-model="scope.row.distributeQty"
              :max="scope.row.skuQty"
              placeholder="请输入数字"
            ></el-input>
          </template>
        </el-table-column>
      </el-data-table>
      <div class="dialog-footer">
        <el-button @click="closeDistributionFormDialog">取 消</el-button>
        <el-button type="primary" @click="distributionFormBtn(1)"
          >确认</el-button
        >
      </div>
    </el-drawer>
    <!-- 确认发货弹窗 -->
    <el-drawer
      :visible.sync="deliveryFormVisible"
      title="确认发货"
      size="50%"
      direction="rtl"
      @close="closeDeliveryFormDialog"
    >
      <el-form-renderer
        ref="deliveryForm"
        :content="deliveryContent"
        class="deliveryForm"
        label-width="150px"
      />
      <div class="dialog-footer">
        <el-button @click="closeDeliveryFormDialog">取 消</el-button>
        <el-button type="primary" @click="deliverySendFormBtn">确认</el-button>
      </div>
    </el-drawer>
    <!-- 确认退款 -->
    <el-drawer
      :visible.sync="deliveryMoneyFormVisible"
      title="确认退款提示"
      size="50%"
      direction="rtl"
      @close="closeDeliveryMoneyFormDialog"
    >
      <el-form-renderer
        ref="deliveryMoneyForm"
        :content="deliveryMoneyContent"
        label-width="150px"
      >
        <div class="moneyTit">
          <div>
            申请退款金额上限为:
            <span>{{ goodsInfo.applyTotalAmount || '' }}</span>
          </div>
          <div class="moneyTit_real">
            实际退款金额上限为:
            <span>{{ goodsInfo.realRefundAmount || '' }}</span>
          </div>
        </div>
      </el-form-renderer>
      <div class="dialog-footer">
        <el-button @click="closeDeliveryMoneyFormDialog">取 消</el-button>
        <el-button type="primary" @click="deliveryMoneySendFormBtn"
          >确认</el-button
        >
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="PutInStoreFormVisible"
      title="验货入库"
      size="60%"
      direction="rtl"
      @close="closePutInStoreFormDialog"
    >
      <el-data-table
        ref="PutInStoreForm"
        v-bind="PutInStoreTable"
        class="drawerTable"
      >
        <el-table-column label="实际退货数量" width="200">
          <template slot="default" slot-scope="scope">
            <el-input
              v-model="scope.row.realReturnQty"
              :max="scope.row.applyReturnSkuQty"
              maxlength="6"
              placeholder="请输入数字"
              @blur="validateNum(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-data-table>
      <div class="dialog-footer">
        <el-button @click="closePutInStoreFormDialog">取 消</el-button>
        <el-button type="primary" @click="PutInStoreFormBtn">确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  ORDER_STATUS,
  ORDER_SALE_STATUS,
} from '~/modules/domain-trade/const/const'
import {
  getCourierCompany,
  putOrderConfirmDelivery,
  getDistribution,
  cancelOrder,
  delOrder,
  putOrderDistribute,
  putOrderJudge,
  orderUrl,
  putAuditAfterSaleOrder,
  orderAfterSaleUrl,
  putOrderAfterSaleAffirmRefundManual,
  delOrderAfterSale,
  putExamineAfterSaleOrder,
} from '~/modules/domain-trade/services/v1/domain-trade-api'
import {amountPattern} from '~/const/pattern'

export default {
  name: 'GoodsInfo',
  props: {
    goodsInfo: {
      type: Object,
      default: () => ({
        applyTotalAmount: '',
        realRefundAmount: '',
      }),
    },
    goodList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      orderStautsObj: {},
      goodsInfos: {},
      goodsList: [],
      saleOrderNo: '',
      distributionFormVisible: false,
      deliveryFormVisible: false,
      PutInStoreFormVisible: false,
      deliveryMoneyFormVisible: false,
      id: this.$route.query.id,
      distributionTable: {
        totalPath: 'payload.number',
        hasNew: false,
        hasDelete: false,
        hasEdit: false,
        hasOperation: false,
        hasPagination: false,
        columns: [
          {
            prop: 'skuId',
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
            prop: 'skuCode',
            label: 'SKU编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'skuWeight',
          //   label: '重量',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'skuVolume',
          //   label: '体积',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'skuAvailStock',
          //   label: '可配库存',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          {
            prop: 'skuQty',
            label: '购买数量',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
      },
      PutInStoreTable: {
        totalPath: 'payload.number',
        hasNew: false,
        hasDelete: false,
        hasEdit: false,
        hasOperation: false,
        hasPagination: false,
        columns: [
          {
            prop: 'skuId',
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
            prop: 'skuCode	',
            label: 'SKU编码',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'skuWeight',
          //   label: '重量',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'skuVolume',
          //   label: '体积',
          //   minWidth: 120,
          //   'show-overflow-tooltip': true,
          // },
          {
            prop: 'skuQty',
            label: '购买数量',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'receivedSkuQty',
            label: '已收货数量',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'applyReturnSkuQty',
            label: '申请退货数量',
            minWidth: 120,
            'show-overflow-tooltip': true,
          },
        ],
      },
      deliveryContent: [
        {
          type: 'select',
          id: 'expressCompName',
          label: '快递公司',
          rules: [{required: true, message: '请选择', trigger: 'change'}],
        },
        {
          label: '物流单号',
          type: 'input',
          id: 'reason',
          el: {
            placeholder: '请输入',
          },
          rules: [{required: true, message: '请输入', trigger: 'change'}],
        },
      ],
      deliveryMoneyContent: [
        {
          type: 'input',
          id: 'applyRefundAmount',
          label: '申请退款金额',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {required: true, message: '请输入', trigger: 'change'},
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
        {
          label: '实际退款金额',
          type: 'input',
          id: 'realRefundAmount',
          el: {
            placeholder: '请输入',
          },
          rules: [
            {required: true, message: '请输入', trigger: 'change'},
            {
              pattern: amountPattern,
              trigger: 'change',
              message: '请输入正确金额',
            },
          ],
        },
      ],
      companyList: [],
    }
  },
  inject: ['status'],
  computed: {
    isOderSale() {
      if (this.status == 1 && this.goodsInfo.status == 8) {
        return true
      }
      if (this.status == 0 && this.goodsInfo.status == 2) {
        return true
      }
      return false
    },
    isHasOrderBtn() {
      // todo 手工开单只是进行扣库存操作，如果需要扣钱自己去线下扣
      const {saleOrderType, status} = this.goodsInfos
      if (saleOrderType == '005' && status == 2) {
        return true
      } else if (saleOrderType == '005') {
        return false
      }
      return true
    },
    distributionUrl() {
      const {id} = this.$route.query
      return `${getDistribution}?saleOrderId=${id}`
    },
    //根据订单状态及类型枚举值
    enumerState() {
      const orderFunList = {
        1: [
          // 待支付
          {
            name: '取消订单',
            type: '',
            func: 'cancelOrder',
            param: {},
          },
        ],
        2: [
          //待客审
          {
            name: '审核通过',
            type: 'primary',
            func: 'orderJudge',
            param: {
              auditResult: '1',
              auditType: '1',
              status: '3',
            },
          },
          {
            name: '取消订单',
            type: '',
            func: 'cancelOrder',
            param: {},
          },
        ],
        3: [
          //待配货
          {
            name: '确认配货',
            type: 'primary',
            func: 'distributionBtn',
            param: {},
          },
          {
            name: '取消配货',
            type: '',
            func: 'distributionFormBtn',
            param: {
              auditResult: '2',
            },
          },
        ],
        4: [
          {
            name: '审核通过',
            type: 'primary',
            func: 'orderJudge',
            param: {
              auditResult: '1',
              auditType: '2',
              status: '5',
            },
          },
          {
            name: '审核驳回',
            type: '',
            func: 'orderJudge',
            param: {
              auditResult: '0',
              auditType: '2',
              status: '2',
            },
          },
        ],
        5: [
          {
            name: '确认发货',
            type: '',
            func: 'deliverySendBtn',
            param: {
              auditResult: '1',
              auditType: '',
              status: '6',
            },
          },
        ],
      }
      const afterFunList = {
        1: [
          {
            name: '同意退货',
            type: 'primary',
            func: 'confrimDistribution',
            param: {
              auditResult: {},
              auditType: '1',
            },
          },
          {
            name: '取消退货',
            type: '',
            func: 'confrimDistribution',
            param: {
              auditResult: {},
              auditType: '2',
            },
          },
        ],
        4: [
          {
            name: '验货入库',
            type: 'primary',
            func: 'checkoutGoodsBtn',
            param: {},
          },
          {
            name: '验货驳回',
            type: '',
            func: 'examineAfterSaleOrder',
            param: {
              auditResult: {},
              auditType: '2',
            },
          },
        ],
        5: [
          {
            name: '确认退款',
            type: 'primary',
            func: 'showReturnMoneydialog',
            param: {},
          },
        ],
      }
      return this.status ? orderFunList : afterFunList
    },
    orderBtnList() {
      const btnlist = Object.keys(this.enumerState).find(
        v => String(v) === String(this.goodsInfos.status),
      )
      return this.enumerState[btnlist]
    },
  },
  watch: {
    goodsInfo: {
      deep: true,
      handler(val) {
        this.goodsInfos = val
        this.saleOrderNo = val.saleOrderNo
        const status = val.staus
        this.orderStautsObj =
          (this.status ? ORDER_STATUS : ORDER_SALE_STATUS).find(
            v => v.orderStatus == String(val.status),
          ) || {}
        const orderTimeStatus = this.status == 1 && (status == 1 || status == 6)
        const afterOrderTimeStatus =
          this.status == 0 &&
          (status == 1 || status == 3 || status == 4 || status == 5)
        if (orderTimeStatus || afterOrderTimeStatus) {
          let remTime = setInterval(function() {
            let curTime = countDown(val.timeEnd)
            if (curTime <= 0) {
              clearInterval(remTime)
              remTime = null
            }
          }, 1000)
        }
      },
    },
    goodList: {
      deep: true,
      handler(val) {
        this.goodsList = val
      },
    },
  },
  created() {
    getCourierCompany().then(res => {
      const {payload: companyList} = res || {}
      this.companyList = companyList
    })
  },
  methods: {
    // todo  待定后续会删除，存在原因后端没有做自动退款功能先注释掉取消订单按钮
    isShowCancelBtn(res) {
      const {saleOrderType, status} = this.goodsInfos

      if (saleOrderType !== '005' && status == 2 && res.func == 'cancelOrder') {
        return false
      }
      return true
    },
    orderBtn(methods, param) {
      const {auditResult, auditType, status} = param
      this[methods](auditResult, auditType, status)
    },
    // 确认配货
    closeDistributionFormDialog() {
      this.$refs.distributionForm.getList()
      this.distributionFormVisible = false
    },
    //确认发货
    closeDeliveryFormDialog() {
      this.$refs.deliveryForm.resetFields()
      this.deliveryFormVisible = false
    },
    //验货入库
    closePutInStoreFormDialog() {
      this.$refs.PutInStoreForm.getList()
      this.$refs.PutInStoreForm.data = []
      this.PutInStoreFormVisible = false
    },
    //确认退款
    closeDeliveryMoneyFormDialog() {
      this.$refs.deliveryMoneyForm.resetFields()
      this.deliveryMoneyFormVisible = false
    },
    // ! 销售管理
    cancelOrder() {
      //销售管理--取消订单
      const params = {
        saleOrderId: this.id,
      }
      cancelOrder(params).then(() => {
        this.replaceUrl()
      })
    },
    orderJudge(auditResult = '1', auditType = '1', orderStatus = '') {
      // 销售管理--审核通过
      const params = {
        saleOrderId: this.id,
        saleOrderNo: this.saleOrderNo, // todo  字段待传
        auditResult, // 0.审核不通过 1.审核通过
        status: orderStatus,
        auditType, //1 待客审 2 待财审
      }
      putOrderJudge(params).then(() => {
        this.replaceUrl()
      })
    },
    distributionBtn() {
      this.distributionFormVisible = true
    },
    distributionFormBtn(num = 1) {
      // 销售管理--配货
      const distrubutionData =
        (this.$refs.distributionForm && this.$refs.distributionForm.data) || []
      const {saleOrderId, saleOrderNo, status} = this.goodsInfos
      const params = {
        commodityDistributes: num == 1 ? distrubutionData : [],
        saleOrderId: this.id,
        saleOrderNo,
        distributeType: num, // 1.确认配货 2.取消配货
      }
      putOrderDistribute(params)
        .then(() => {
          this.replaceUrl()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    deliverySendBtn() {
      this.deliveryFormVisible = true
      this.$nextTick(() => {
        const deliveryFormDom = this.$refs.deliveryForm
        deliveryFormDom.setOptions(
          'expressCompName',
          this.companyList.map(v => ({
            label: v.expressCompName,
            value: v.expressCompCode,
            ...v,
          })),
        )
      })
    },
    deliverySendFormBtn(result = '1', _, orderStatus = '6') {
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          // 销售管理--确认发货
          const deliveryFormData = this.$refs.deliveryForm.getFormValue() || {}
          const {saleOrderId, saleOrderNo} = this.goodsInfos
          const params = {
            saleOrderId,
            saleOrderNo,
            auditResult: result,
            status: orderStatus,
            ...deliveryFormData,
          }
          putOrderConfirmDelivery(params)
            .then(() => {
              this.replaceUrl()
            })
            .finally(() => {
              this.deliveryFormVisible = false
            })
        } else {
          return false
        }
      })
    },

    // ! 售后订单
    confrimDistribution(row = {}, num = 1) {
      //售后订单 --- 确认/取消退货
      const {id, saleOrderNo, afterSaleType} = this.goodsInfos
      const params = {
        afterSaleOrderId: this.id,
        afterSaleOrderNo: saleOrderNo,
        afterSaleType,
        afterSaleOrderReturnType: num, // 1.确认退货2.取消退货
      }
      putAuditAfterSaleOrder(params)
        .then(() => {
          this.replaceUrl()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    examineAfterSaleOrder(row = {}, num = 1, extendsArr = []) {
      //售后订单 --验货入库/验货驳回
      const {id, saleOrderNo, status} = this.goodsInfos
      const paramObj = {
        commodityReturns: extendsArr.map(v => ({
          ...v,
          afterSaleOrderItemId: v.id,
        })),
        afterSaleOrderId: this.id,
        afterSaleOrderExamineType: num, // 1.入库 2.取驳回
      }
      putExamineAfterSaleOrder(paramObj)
        .then(() => {
          this.replaceUrl()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    checkoutGoodsBtn() {
      this.PutInStoreFormVisible = true
      this.$nextTick(() => {
        this.$refs.PutInStoreForm.data = this.goodsList
      })
    },
    PutInStoreFormBtn() {
      this.messDialog(
        '验货确认后，将会自动生成销售退货入库单，增加商品库存，你确认验货入库吗？',
        '验货入库提示',
      ).then(() => {
        const distrubutionData = this.$refs.PutInStoreForm.data
        this.examineAfterSaleOrder({}, 1, distrubutionData)
        this.PutInStoreFormVisible = false
      })
    },
    showReturnMoneydialog() {
      this.deliveryMoneyFormVisible = true
    },
    deliveryMoneySendFormBtn() {
      this.$refs.deliveryMoneyForm.validate(valid => {
        if (valid) {
          //售后订单 -- 确认退款
          const {applyRefundAmount, realRefundAmount} =
            this.$refs.deliveryMoneyForm.getFormValue() || {}
          const {
            id,
            saleOrderId,
            afterSaleOrderNo,
            afterSaleOrderId,
            applyTotalAmount,
            realRefunAmount,
          } = this.goodsInfos
          if (
            Number(applyRefundAmount) > Number(applyTotalAmount) &&
            Number(realRefundAmount) > Number(realRefunAmount)
          ) {
            this.$message.warning('请认真核对退款金额')
            return
          }
          this.$confirm(
            '确定退款后，系统将会原路返回会员实际支付渠道',
            '确认退款提示',
            {
              type: 'warning',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  const params = {
                    afterSaleOrderId: this.id,
                    afterSaleOrderNo,
                    applyRefundAmount,
                    realRefundAmount,
                  }
                  putOrderAfterSaleAffirmRefundManual(params)
                    .then(() => {
                      this.replaceUrl()
                      done()
                    })
                    .finally(() => {
                      this.deliveryMoneyFormVisible = false
                      instance.confirmButtonLoading = false
                    })
                  return
                }
                done()
              },
            },
          ).catch(() => {})
        } else {
          return false
        }
      })
    },
    messDialog(mes, prompt = '提示', type = 'warning') {
      return this.$confirm(mes, prompt, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type,
      })
    },
    validateNum({applyReturnSkuQty, realReturnQty}) {
      if (applyReturnSkuQty !== parseInt(realReturnQty, 10)) {
        this.$message.warning('实际退货数量不能大于申请退货数量')
      }
    },
    replaceUrl() {
      this.$message.success('修改成功')
      this.$router.replace(!!this.status ? '/order' : '/after-sale/returned')
    },
    // 倒计时
    countDown(DateString) {
      let date = new Date().getTime()
      let endDate = DateString.length == 10 ? DateString * 1000 : DateString //截止时间
      let difference = endDate - date //时间差
      let d, h, m, s, ms
      d = Math.floor(difference / 1000 / 60 / 60 / 24)
      h = Math.floor((difference / 1000 / 60 / 60) % 24)
      m = Math.floor((difference / 1000 / 60) % 60)
      s = Math.floor((difference / 1000) % 60)
      ms = Math.floor(difference % 1000)
      s = s < 10 ? '0' + s : s
      m = m < 10 ? '0' + m : m
      h = h < 10 ? '0' + h : h
      return difference
    },
  },
}
</script>

<style scoped lang="less">
.blue {
  color: #2878ff;
  font-size: 16px;
}

.ccc {
  color: #828282;
  font-size: 16px;
}

.goodsInfo_Info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.goodsInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 40px 16px;
  overflow: hidden;

  &-head {
    height: 92px;
    padding: 15px 40px;

    &-font {
      margin-top: 10px;
      font-size: 16px;
    }
  }

  &-cont {
    width: 126px;
    margin-bottom: 30px;
  }

  &-foot {
    display: flex;
    flex-direction: row;
  }
}

.svg-FontSize {
  width: 30px;
  height: 29px;
  opacity: 0.5;
}

.btnPadLeft {
  margin-left: 10px;
  border-radius: 4px;
}

.deliveryForm {
  text-align: left;
}

.drawerTable {
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

.moneyTit {
  display: flex;
  padding: 0 45px;

  &_real {
    margin-left: 30px;
  }

  span {
    color: #e24156;
  }
}
</style>
