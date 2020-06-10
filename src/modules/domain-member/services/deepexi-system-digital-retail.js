import axios from '@/services/apiClient'

const apiVersion = '/api/v1'
const serviceType = '/deepexi-system-digital-retail'
const basicUrl = `${serviceType}${apiVersion}`

/**
 * @description 会员信息列表
 */
export const memberList = `${basicUrl}/members`

/**
 * @description 会员信息-会员详情
 * @param {*} id 会员id
 */
export const getMemberInfo = id => axios.$get(`${basicUrl}/members/${id}`)

/**
 * @description 会员信息-添加
 * @param {*} params body请求体
 */
export const addMember = params => axios.$post(`${basicUrl}/members`, params)

/**
 * @description 会员信息-编辑
 * @param {*} params body请求体
 * @param {*} id 会员id
 */
export const editMember = (params, id) =>
  axios.$put(`${basicUrl}/members/${id}`, params)

/**
 * @description 会员信息-删除
 * @param {*} id 会员id
 */
export const deleteMember = id => axios.$delete(`${basicUrl}/members/${id}`)

/**
 * @description 会员信息-修改状态
 * @param {*} id 会员id
 * @param {*} statusCode 状态
 */
export const editMemberStatus = (id, statusCode) =>
  axios.$put(`${basicUrl}/members/${id}/status/${statusCode}`)

/**
 * @description 会员信息-导入会员
 * @param {*} data 会员数组
 */
export const importMembers = data =>
  axios.$post(`${basicUrl}/members/batch`, {importList: data})

/**
 * @description 会员信息-查看详情-订单信息
 * @param {*} account 会员账号
 */
export const orderList = id => `${basicUrl}/sales?memberId=${id}`
