import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version

/**
 * 查询商品列表
 */
export const goodsListUrl = `${baseUrl}/commodity/shelves/page?status=1`

export const getSingleGoods = id =>
  axios.$get(`${baseUrl}/commodity/shelves/${id}`)
/**
 * 查询专题
 */
export const getSubjects = () => axios.$get(`${baseUrl}/subjects`)

/**
 * 新增专题
 */
export const newSubject = data => axios.$post(`${baseUrl}/subjects`, data)

/**
 * 编辑专题
 */
export const editSubject = (id, data) =>
  axios.$put(`${baseUrl}/subjects/${id}`, data)

/**
 * 删除专题
 */
export const deleteSubject = id => axios.$delete(`${baseUrl}/subjects/${id}`)
