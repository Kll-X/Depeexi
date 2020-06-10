import axios from '@/services/apiClient'
const context = '/deepexi-system-digital-retail'
const version = '/api/v1'
const baseUrl = context + version

/**
 * 查询精选
 */
export const getRecommendation = () =>
  axios.$get(`${baseUrl}/recommendations/status`)

/**
 * 新增榜单
 */
export const changeRecommendation = (id, status) =>
  axios.$put(`${baseUrl}/recommendations/${id}/status`, {
    status,
  })
