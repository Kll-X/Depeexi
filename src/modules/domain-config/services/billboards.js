import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version

export const getAllBrands = () =>
  axios.$get(`${baseUrl}/commodity/brands?page=1&size=999`)

export const getAllCategory = () =>
  axios.$get(`${baseUrl}/commodity/backCategories/tree?typeCode=0`)

/**
 * 查询榜单
 */
export const getBillboards = () => axios.$get(`${baseUrl}/billboards`)

/**
 * 新增榜单
 */
export const newBillboard = data => axios.$post(`${baseUrl}/billboards`, data)

/**
 * 编辑榜单
 */
export const editBillboard = (id, data) =>
  axios.$put(`${baseUrl}/billboards/${id}`, data)

/**
 * 删除榜单
 */
export const deleteBillboard = id =>
  axios.$delete(`${baseUrl}/billboards/${id}`)
