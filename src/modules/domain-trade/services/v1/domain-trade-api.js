/*
 * @Description:  交易域api
 * @Date: 2019-08-14 20:02:18
 */
import axios from '@/services/apiClient'
const serviceType = '/deepexi-system-digital-retail'
const apiVersion = '/api/v1'
const basicUrl = `${serviceType}${apiVersion}`
const mockServer = 'http://39.100.141.76:3000/mock/679'

// ! 系统配置
/**
 * @description: 获取渠道
 */
export const getChannel = params =>
  axios.$get(`${basicUrl}/sales/queryChannelList`, params)

/**
 * @description: 获取快递公司
 */
export const getCourierCompany = params =>
  axios.$get(`${basicUrl}/sales/expressCompInfoQuery`, params)

// ! 订单列表
/**
 * @description: 订单列表url
 */

export const orderUrl = `${basicUrl}/sales`
/**
 * @description: 取消订单
 */
export const cancelOrder = params =>
  axios.$put(`${basicUrl}/sales/cancel`, params)
/**
 * @description: 订单审核(待客审和待财审订单审核)
 */
export const putOrderJudge = params =>
  axios.$put(`${basicUrl}/sales/saleOrderAudit`, params)

/**
 * @description: 订单配货
 */
export const putOrderDistribute = params =>
  axios.$put(`${basicUrl}/sales/saleOrderDistribute`, params)

/**
 * @description: 确认发货
 */
export const putOrderConfirmDelivery = params =>
  axios.$put(`${basicUrl}/sales/confirmDelivery`, params)
/**
 * @description: 获取配货列表
 */
export const getDistribution = `${basicUrl}/sales/saleOrderItemQuery`

/**
 * @description: 删除订单
 * @param {id} 订单id
 */
export const delOrder = id => axios.$delete(`${basicUrl}/sales/${id}`)

// !  售后
/**
 * @description: 订单列表url
 */

export const orderAfterSaleUrl = `${basicUrl}/aftersales`

/**
 * @description: 订单验货
 */
export const putExamineAfterSaleOrder = params =>
  axios.$put(`${basicUrl}/aftersales/examineAfterSaleOrder`, params)

/**
 * @description: 售后退款
 */
export const putOrderAfterSaleAffirmRefundManual = params =>
  axios.$put(`${basicUrl}/aftersales/affirmRefundManual`, params)

/**
 * @description: 售后订单删除
 * @param {id} 订单id
 */
export const delOrderAfterSale = id =>
  axios.$delete(`${basicUrl}/aftersales/${id}`)
/**
 * @description: 退货单审核
 */
export const putAuditAfterSaleOrder = params =>
  axios.$put(`${basicUrl}/aftersales/auditAfterSaleOrder`, params)
/**
 * @description: 查看销售管理订单详情
 * @param {id} 订单id
 */
export const getOrderBaseInfo = id => axios.$get(`${basicUrl}/sales/${id}`)
/**
 * @description: 查看售后订单详情
 * @param {id} 订单id
 */
export const getAfterOrderBaseInfo = id =>
  axios.$get(`${basicUrl}/aftersales/${id}`)

// ! 手工开单
/**
 * @description:  新增手工开单
 */
export const postSaleOrderManual = params =>
  axios.$post(`${basicUrl}/sales/saleOrderManual`, params)
/**
 * @description: 查询上架商品列表
 * 1 是上架, 2 是待上架, 0 是未上架
 */
export const getCommodityList = `${basicUrl}/commodity/shelves/page?status=1`
