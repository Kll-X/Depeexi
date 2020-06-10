<template>
  <div>
    <el-data-table
      ref="OrderTable"
      v-bind="OrderTableConfig"
      :url="orderTableUrl"
      @reset="resetData"
    />

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
        label-width="100px"
        class="drawerTable"
      />
      <div class="dialog-footer">
        <el-button @click="closeDeliveryFormDialog">取 消</el-button>
        <el-button type="primary" @click="deliverySendFormBtn">确认</el-button>
      </div>
    </el-drawer>
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
              @change="validateNum(scope.row)"
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
  </div>
</template>
<script>
import {
  getChannel,
  getCourierCompany,
  putOrderConfirmDelivery,
  getDistribution,
  cancelOrder,
  delOrder,
  putOrderDistribute,
  putOrderJudge,
  orderUrl,
} from '~/modules/domain-trade/services/v1/domain-trade-api'

import {numberPattern} from '~/const/pattern'
export default {
  name: 'OrderTable',
  props: {
    orderStauts: {
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
      saleOrder: {},
      OrderTableConfig: {
        hasNew: false,
        hasDelete: false,
        totalPath: 'payload.totalElements',
        hasEdit: false,
        columns: [
          {
            prop: 'status',
            minWidth: '200px',
            label: '订单状态',
            formatter: ({status}) => {
              const orderStatus = this.formatterSelectData(
                this.orderStauts,
                status,
              )
              return orderStatus ? orderStatus : '已删除'
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'saleOrderNo',
            minWidth: '200px',
            label: '订单号',
            'show-overflow-tooltip': true,
          },
          {
            prop: 'sourceChannel',
            minWidth: '200px',
            label: '来源渠道',
            formatter: ({sourceChannel}) => {
              // this.formatterSelectData(
              //   this.channelList,
              //   sourceChannel,
              //   'channelId',
              //   'channelName',
              // )
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
            prop: 'originalTotalAmount',
            minWidth: '200px',
            label: '订单金额',
            formatter: ({originalTotalAmount}) => {
              return this.formatterNum(originalTotalAmount)
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'changeAmount',
            minWidth: '200px',
            label: '优惠金额',
            formatter: ({changeAmount}) => {
              return this.formatterNum(changeAmount)
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'realPayAmount',
            minWidth: '200px',
            label: '实付金额',
            formatter: ({realPayAmount}) => {
              return this.formatterNum(realPayAmount)
            },
            'show-overflow-tooltip': true,
          },
          {
            prop: 'memberAccountId',
            minWidth: '120px',
            label: '会员账号',
            'show-overflow-tooltip': true,
            formatter: ({memberAccountId, saleOrderType}) => {
              const mobile = saleOrderType == '005' ? '' : memberAccountId
              return <span>{mobile}</span>
            },
          },
          {
            minWidth: '120px',
            label: '会员手机号',
            'show-overflow-tooltip': true,
            formatter: ({memberAccountId, saleOrderType}) => {
              const mobile = saleOrderType == '005' ? '' : memberAccountId
              return <span>{mobile}</span>
            },
          },
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '手工开单',
            atClick: selected => {
              this.$router.push({
                path: '/order/manual',
                query: {
                  type: this.orderType,
                },
              })
              return Promise.resolve(false)
            },
          },
        ],
        searchForm: [
          {
            type: 'select',
            id: 'sourceChannel',
            label: '渠道',
            collapsible: false,
            el: {
              placeholder: '请选择',
            },
          },
          //  1.0隐藏--产品说的
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
            label: '订单号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'input',
            id: 'memberAccountId',
            label: '会员账号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'input',
            id: 'mobile',
            label: '手机号',
            el: {
              placeholder: '请输入',
            },
          },
          {
            type: 'checkbox',
            id: 'type',
            label: '仅显示手工单',
            outputFormat: val => {
              // 005 手工单 1常规单
              return val ? '005' : ''
            },
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
           *  1  待支付
           *  2  待客审
           *  3  待配货
           *  4  待财审
           *  5  待发货
           *  6  待收货
           *  7  已完成
           *  8  已取消
           */
          {
            text: '查看',
            atClick: ({saleOrderId}) => {
              this.$router.push({
                path: '/order/detail',
                query: {
                  id: saleOrderId,
                  type: this.orderType,
                  status: 1,
                },
              })
              return Promise.resolve(false)
            },
          },
          {
            // todo 待客审支持取消订单，但是目前后端不支持自动流状态并退款
            show: row =>
              this.isShowCancel(row, '1') || this.isShowCancel(row, '2'),
            text: '取消订单',
            atClick: ({saleOrderId}) => {
              this.messDialog(
                '取消订单后将无法恢复，你确认取消订单吗？',
                '取消订单提示',
              ).then(() => {
                const params = {
                  saleOrderId,
                  status: '8',
                }
                cancelOrder(params).then(() => {
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
          },
          {
            text: '审核通过',
            atClick: ({saleOrderId, saleOrderNo}) => {
              this.messDialog(
                '审核通过后将进入下一环节，你确认审核通过吗?',
                '审核通过提示',
              ).then(() => {
                const params = {
                  saleOrderId,
                  saleOrderNo,
                  auditResult: '1', // 0.审核不通过 1.审核通过
                  status: '3',
                  auditType: '1', //1 待客审 2 待客审
                }
                putOrderJudge(params).then(() => {
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '2'),
          },
          {
            text: '确认配货',
            atClick: row => {
              this.saleOrder = row
              this.distributionFormVisible = true
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '3'),
          },
          {
            text: '取消配货',
            atClick: row => {
              this.saleOrder = row
              this.messDialog(
                '取消配货后，订单状态将更新为待客审，你确认取消配货吗?',
                '取消配货提示',
              ).then(() => {
                this.distributionFormBtn(2)
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '3'),
          },
          {
            text: '审核通过',
            atClick: ({saleOrderId, saleOrderNo}) => {
              this.messDialog(
                '审核通过后将进入下一环节，你确认审核通过吗?',
                '审核通过提示',
              ).then(() => {
                const params = {
                  saleOrderId,
                  saleOrderNo,
                  status: '5',
                  auditResult: '1',
                  auditType: '2', //1 待客审 2 待客审
                }
                putOrderJudge(params).then(() => {
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '4'),
          },
          {
            text: '审核驳回',
            atClick: ({saleOrderId, saleOrderNo}) => {
              this.messDialog(
                '财审驳回后，订单状态将更新为待客审，你确认驳回吗?',
                '审核驳回提示',
              ).then(() => {
                const params = {
                  saleOrderId,
                  saleOrderNo,
                  status: '2',
                  auditResult: '0',
                  auditType: '2', //待客审
                }
                putOrderJudge(params).then(() => {
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '4'),
          },
          {
            text: '确认发货',
            atClick: row => {
              this.saleOrder = row
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
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '5'),
          },
          {
            text: '删除订单',
            type: 'danger',
            atClick: ({saleOrderId}) => {
              this.messDialog(
                '删除订单后将无法恢复，你确认删除吗?',
                '删除订单提示',
              ).then(() => {
                delOrder(saleOrderId).then(() => {
                  this.$message.success('修改成功')
                  this.setTableList()
                })
              })
              return Promise.resolve(false)
            },
            show: row => this.isShowBtn(row, '8'),
          },
        ],
      },
      deliveryFormVisible: false,
      distributionFormVisible: false,
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
      channelList: [], //渠道
      companyList: [], // 快递公司
    }
  },
  computed: {
    orderTableUrl() {
      const subStr = this.orderType == 0 ? '' : this.orderType
      return `${orderUrl}?statusStr=${subStr}`
    },
    distributionUrl() {
      const {saleOrderId} = this.saleOrder
      return `${getDistribution}?saleOrderId=${saleOrderId}`
    },
  },

  created() {
    // ! 获取渠道/快递公司选择框数据
    try {
      // getChannel() 暂时隐藏
      Promise.all([getCourierCompany()]).then(res => {
        this.$nextTick(() => {
          // {payload: channelList}
          const [{payload: companyList}] = res || [
            // [],
            [],
          ]
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
          this.companyList = companyList
          const searchFromDOM =
            this.$refs.OrderTable && this.$refs.OrderTable.$refs.searchForm
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
      })
    } catch (error) {}
  },
  methods: {
    setTableList() {
      return this.$refs.OrderTable.getList()
    },
    isShowCancel({status, saleOrderType}, typeNum = '1') {
      if (status == 1) {
        return true
      } else if (status == 2 && saleOrderType == '005') {
        return true
      }
      return false
    },
    // 根据状态显示按钮
    isShowBtn({status, saleOrderType}, typeNum = '1') {
      if (status == typeNum && saleOrderType == '005') {
        return true
      }
      // 005 代表手工开单
      return !!(String(status) === typeNum) && saleOrderType !== '005'
    },
    // 金额保留2位小数
    formatterNum(num = 0) {
      return Number(num).toFixed(2)
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
    resetData() {
      this.$nextTick(() => {
        this.$refs.OrderTable.$refs.searchForm.value.type = ''
      })
    },
    closeDeliveryFormDialog() {
      this.$refs.deliveryForm.resetFields()
      this.deliveryFormVisible = false
    },
    closeDistributionFormDialog() {
      this.$refs.distributionForm.getList()
      this.distributionFormVisible = false
    },
    // 确认发货
    deliverySendFormBtn() {
      this.$refs.deliveryForm.validate(valid => {
        if (valid) {
          const deliveryFormData = this.$refs.deliveryForm.getFormValue() || {}
          const {saleOrderId, saleOrderNo} = this.saleOrder
          const params = {
            saleOrderId,
            saleOrderNo,
            auditResult: '1',
            status: '6',
            ...deliveryFormData,
          }
          putOrderConfirmDelivery(params)
            .then(() => {
              this.$message.success('修改成功')
              this.setTableList()
            })
            .finally(() => {
              this.deliveryFormVisible = false
            })
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
    // 确认配货
    distributionFormBtn(num = 1) {
      if (num == 1) {
        const isHasQty = this.$refs.distributionForm.data.every(
          v =>
            typeof Number(v.distributeQty) == 'number' &&
            Number(v.distributeQty) > 0,
        )
        if (!isHasQty) {
          this.$message.warning('请认真核对配货数')
          return false
        }
      }
      const distrubutionData =
        (this.$refs.distributionForm && this.$refs.distributionForm.data) || []
      const {saleOrderId, saleOrderNo, status} = this.saleOrder
      const params = {
        commodityDistributes: num == 1 ? distrubutionData : [],
        saleOrderId,
        saleOrderNo,
        distributeType: num, // 1.确认配货 2.取消配货
      }
      putOrderDistribute(params)
        .then(() => {
          this.$message.success('修改成功')
          this.setTableList()
        })
        .finally(() => {
          this.distributionFormVisible = false
        })
    },
    validateNum({distributeQty, skuQty}) {
      if (distributeQty > parseInt(skuQty, 10)) {
        const hasReturnQty = skuQty
          ? `,最大数量为  ${skuQty ? skuQty : ''}`
          : ''
        this.$message.warning(`配货数量不能大于购买数量${hasReturnQty}`)
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
</style>
