<template>
  <div>
    <el-data-table
      ref="OrderAfterSaleTable"
      v-bind="OrderAfterSaleTableConfig"
      :url="OrderAfterSaleTableUrl"
    />

    <!-- 确认退款弹窗 -->
    <el-drawer
      :visible.sync="deliveryFormVisible"
      title="确认退款提示"
      size="50%"
      direction="rtl"
      @close="closeDeliveryFormDialog"
    >
      <el-form-renderer
        ref="deliveryForm"
        :content="deliveryContent"
        label-width="150px"
      >
        <div class="moneyTit">
          <div>
            申请退款金额上限为:
            <span>{{ saleOrder.applyRefundAmount || '' }}</span>
          </div>
          <div class="moneyTit_real">
            实际退款金额上限为:
            <span>{{ saleOrder.realRefundAmount || '' }}</span>
          </div>
        </div>
      </el-form-renderer>
      <div class="dialog-footer">
        <el-button @click="closeDeliveryFormDialog">取 消</el-button>
        <el-button type="primary" @click="deliverySendFormBtn">确认</el-button>
      </div>
    </el-drawer>
    <!-- 确认配货弹窗 -->
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
              @change="validateNum(scope.row)"
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
  // getChannel,
  delOrder,
  putAuditAfterSaleOrder,
  orderAfterSaleUrl,
  putOrderAfterSaleAffirmRefundManual,
  delOrderAfterSale,
  getAfterOrderBaseInfo,
  putExamineAfterSaleOrder,
} from '~/modules/domain-trade/services/v1/domain-trade-api'
import {RETURN_GOODS_TYPE} from '~/modules/domain-trade/const/const'
import {amountPattern, numberPattern} from '~/const/pattern'

export default {
  name: 'OrderSaleTable',
  props: {
    orderSaleStauts: {
      type: Array,
      default: () => [],
    },
    orderType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      saleOrder: {
        applyRefundAmount: '',
        realRefundAmount: '',
      },
      OrderAfterSaleTableConfig: {
        totalPath: 'payload.totalElements',
        hasNew: false,
        hasDelete: false,
        hasEdit: false,
        columns: [
          {
            prop: 'status',
            minWidth: '200px',
            label: '退货单状态',
            formatter: ({status}) => {
              const orderStatus = this.formatterSelectData(
                this.orderSaleStauts,
                status,
              )
              return orderStatus ? orderStatus : '已删除'
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'afterSaleOrderNo',
            minWidth: '200px',
            label: '退货订单号',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'aftersaleType',
            minWidth: '200px',
            label: '退货类型',
            formatter: ({afterSaleType}) => {
              return this.formatterSelectData(
                RETURN_GOODS_TYPE,
                afterSaleType,
                'value',
              )
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'sourceChannel',
            minWidth: '200px',
            label: '来源渠道',
            formatter: ({sourceChannel}) => {
              // this.formatterSelectData(
              //     this.channelList,
              //     sourceChannel,
              //     'channelId',
              //     'channelName',
              //   )
              return <span>移动商城</span>
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'sellerName',
            minWidth: '200px',
            label: '来源店铺',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'saleOrderNo',
            minWidth: '200px',
            label: '关联订单号',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'returnCause',
            minWidth: '200px',
            label: '退货原因',
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'returnNumPlan',
          //   minWidth: '120px',
          //   label: '计划退货数量',
          // },
          // {
          //   prop: 'realReturnNum',
          //   minWidth: '120px',
          //   label: '实际退货数量',
          // },
          {
            prop: 'applyRefundAmount',
            minWidth: '120px',
            label: '计划退款金额',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'realRefundAmount',
            minWidth: '120px',
            label: '实际退款金额',
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'depositoryName',
          //   minWidth: '120px',
          //   label: '退货仓库',
          // },
          // {
          //   prop: 'logisticsComp',
          //   minWidth: '120px',
          //   label: '退货物流公司',
          // },
          // {
          //   prop: 'trackingNo',
          //   minWidth: '120px',
          //   label: '退货物流单号',
          // },
          {
            prop: 'buyerName',
            label: '退货申请人',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'applyTime',
          //   minWidth: '120px',
          //   label: '退货申请时间',
          // },
        ],
        searchForm: [
          {
            type: 'select',
            id: 'sourceChannel',
            label: '来源渠道',
            el: {
              placeholder: '请选择',
            },
          },
          // {
          //   type: 'input',
          //   id: 'sellerId',
          //   label: '来源店铺',
          //   el: {
          //     placeholder: '请输入',
          //   },
          //   rules: [
          //     {
          //       pattern: numberPattern,
          //       trigger: 'change',
          //       message: '请输入数字',
          //     },
          //   ],
          // },
          {
            type: 'input',
            id: 'saleOrderNo',
            label: '关联订单号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'input',
            id: 'afterSaleOrderNo',
            label: '退货单号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'select',
            id: 'afterSaleType',
            label: '退货类型',
            el: {
              placeholder: '请输入',
            },
            options: RETURN_GOODS_TYPE,
          },
        ],
        formAttrs: {
          'label-width': '200px',
        },
        operationAttrs: {
          width: '220px',
          fixed: 'right',
        },
        extraButtons: [
          /**
           * @备注 状态描述
           *  1  待审核
           *  2  待退货
           *  3  待验货
           *  4  待退款
           *  5  已完成
           *  6  已取消
           */
          {
            text: '查看',
            atClick: ({id}) => {
              this.$router.push({
                path: '/after-sale/returned/detail',
                query: {
                  id,
                  type: this.orderType,
                  status: 0,
                },
              })
              return Promise.resolve(false)
            },
          },
          {
            show: row => this.isShowBtn(row, '1'),
            text: '同意退货',
            atClick: row => {
              this.saleOrder = row
              this.messDialog(
                '同意退货后将进入下一环节，你确认退货吗?',
                '同意退货提示',
              ).then(() => {
                this.confrimDistribution(row, 1, 5)
              })
              return Promise.resolve(false)
            },
          },
          {
            text: '取消退货',
            atClick: row => {
              this.saleOrder = row
              this.messDialog(
                '取消退货后，需重新在提交，你确认取消退货吗?',
                '取消退货提示',
              ).then(() => {
                this.confrimDistribution(row, 2)
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '1', '2'),
          },
          {
            text: '验货入库',
            atClick: row => {
              this.saleOrder = row
              this.PutInStoreFormVisible = true
              this.getAfterSaleOrderInfo(row.id)
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '4'),
          },
          {
            text: '验货驳回',
            atClick: row => {
              this.messDialog(
                '验货驳回后，退货单状态更新为待审核，你确认验货驳回吗？',
                '验货驳回提示',
              ).then(() => {
                this.examineAfterSaleOrder(row, 2)
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '4'),
          },
          {
            text: '确认退款',
            atClick: row => {
              this.saleOrder = row
              this.deliveryFormVisible = true
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '5'),
          },
          {
            text: '删除',
            type: 'danger',
            atClick: ({id}) => {
              this.messDialog(
                '删除退货单后将无法恢复，你确认删除吗？',
                '删除提示',
              ).then(() => {
                delOrderAfterSale(id).then(() => {
                  this.$message.success('修改成功')
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '2'),
          },
        ],
      },
      deliveryFormVisible: false,
      PutInStoreFormVisible: false,
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
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuName',
            label: '商品名称',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'skuCode	',
            label: 'SKU编码',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'skuWeight',
          //   label: '重量',
          //   minWidth: '120px',
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'skuVolume',
          //   label: '体积',
          //   minWidth: '120px',
          //   'show-overflow-tooltip': true,
          // },
          {
            prop: 'skuQty',
            label: '购买数量',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'receivedSkuQty',
            label: '已收货数量',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'applyReturnSkuQty',
            label: '申请退货数量',
            minWidth: '120px',
            'show-overflow-tooltip': true,
          },
        ],
      },
      deliveryContent: [
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
      channelList: [], //渠道
    }
  },
  computed: {
    OrderAfterSaleTableUrl() {
      const subStr = this.orderType == 0 ? '' : this.orderType
      return `${orderAfterSaleUrl}?statusStr=${subStr}`
    },
  },
  created() {
    // ! 获取渠道选择框数据
    // getChannel().then(res => {
    this.$nextTick(() => {
      // const {payload: channelList} = res || {}
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
      this.channelList = channelList
      const searchFromDOM =
        this.$refs.OrderAfterSaleTable &&
        this.$refs.OrderAfterSaleTable.$refs.searchForm
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
    setTableList() {
      return this.$refs.OrderAfterSaleTable.getList()
    },
    // 根据状态显示按钮
    isShowBtn({status}, typeNum = '1') {
      return !!(String(status) === typeNum)
    },
    // 动态获取名字
    formatterSelectData(
      arr = [],
      name = '0',
      status = 'orderStatus',
      label = 'label',
    ) {
      const getObj = arr.find(v => String(v[status]) === String(name))
      const thName = (getObj ? getObj : {})[label] || ''
      return thName
    },
    // 金额保留2位小数
    formatterNum(num = 0) {
      return Number(num).toFixed(2)
    },
    closeDeliveryFormDialog() {
      this.$refs.deliveryForm.resetFields()
      this.deliveryFormVisible = false
    },
    closePutInStoreFormDialog() {
      this.$refs.PutInStoreForm.getList()
      this.$refs.PutInStoreForm.data = []
      this.PutInStoreFormVisible = false
    },
    deliverySendFormBtn() {
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          const {applyRefundAmount, realRefundAmount} =
            this.$refs.deliveryForm.getFormValue() || {}
          const {
            id,
            saleOrderId,
            afterSaleOrderNo,
            afterSaleOrderId,
            applyRefundAmount: applyRefunAmount,
            realRefundAmount: realRefunAmount,
          } = this.saleOrder
          if (
            !(
              applyRefundAmount <= applyRefunAmount &&
              realRefundAmount <= realRefunAmount
            )
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
                    afterSaleOrderId: id,
                    afterSaleOrderNo,
                    realRefundAmount,
                    applyRefundAmount,
                  }
                  putOrderAfterSaleAffirmRefundManual(params)
                    .then(() => {
                      this.$message.success('修改成功')
                      this.setTableList()
                      done()
                    })
                    .finally(() => {
                      this.deliveryFormVisible = false
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
    // 确认/取消退货
    confrimDistribution(row = {}, num = 1) {
      const {distrubutionData, id, saleOrderNo, afterSaleType} = row
      const params = {
        distrubutionData,
        afterSaleOrderId: id,
        afterSaleOrderNo: saleOrderNo,
        afterSaleType,
        afterSaleOrderReturnType: num, // 1.确认退货2.取消退货
      }
      putAuditAfterSaleOrder(params)
        .then(() => {
          this.$message.success('修改成功')
          this.setTableList()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    //验货入库/验货驳回
    examineAfterSaleOrder(row = {}, num = 1, extendsArr = []) {
      const {id, saleOrderNo, status} = row
      const paramObj = {
        commodityReturns: extendsArr.map(v => ({
          ...v,
          afterSaleOrderItemId: v.id,
        })),
        afterSaleOrderId: id,
        status,
        afterSaleOrderExamineType: num, // 1.入库 2.取驳回
      }
      putExamineAfterSaleOrder(paramObj)
        .then(() => {
          this.$message.success('修改成功')
          this.setTableList()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    PutInStoreFormBtn() {
      const isHasQty = this.$refs.PutInStoreForm.data.every(
        v =>
          typeof Number(v.realReturnQty) == 'number' &&
          Number(v.realReturnQty) > 0,
      )
      if (!isHasQty) {
        this.$message.warning('请认真核对实际退货数量')
        return false
      }
      this.messDialog(
        '验货确认后，将会自动生成销售退货入库单，增加商品库存，你确认验货入库吗？',
        '验货入库提示',
      ).then(() => {
        const distrubutionData = this.$refs.PutInStoreForm.data
        this.examineAfterSaleOrder(this.saleOrder, 1, distrubutionData)
        this.PutInStoreFormVisible = false
      })
    },
    // 获取订单详情
    getAfterSaleOrderInfo(id) {
      getAfterOrderBaseInfo(id).then(({payload: {saleOrderItems}}) => {
        this.$nextTick(() => {
          this.$refs.PutInStoreForm.data = saleOrderItems
        })
      })
    },
    validateNum({applyReturnSkuQty, realReturnQty}) {
      if (parseInt(realReturnQty, 10) > applyReturnSkuQty) {
        const hasReturnQty = applyReturnSkuQty
          ? `,最大数量为  ${applyReturnSkuQty ? applyReturnSkuQty : ''}`
          : ''
        this.$message.warning(`实际退货数量不能大于申请退货数量${hasReturnQty}`)
      }
    },
  },
}
</script>
<style lang="less" scoped>
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
