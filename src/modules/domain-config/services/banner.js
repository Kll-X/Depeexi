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
 * 查询轮播图
 */
export const getBanners = () => axios.$get(`${baseUrl}/banners`)

/**
 * 新增轮播图
 */
export const newBanner = data => axios.$post(`${baseUrl}/banners`, data)

/**
 * 编辑轮播图
 */
export const editBanner = (id, data) =>
  axios.$put(`${baseUrl}/banners/${id}`, data)

/**
 * 删除轮播图
 */
export const deleteBanner = id => axios.$delete(`${baseUrl}/banners/${id}`)
